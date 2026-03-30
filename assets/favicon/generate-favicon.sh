#!/bin/sh
set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
MASTER_SVG="$SCRIPT_DIR/favicon.svg"
TMP_DIR="$(mktemp -d)"
RENDERED_PNG="$TMP_DIR/$(basename "$MASTER_SVG").png"

cleanup() {
  rm -rf "$TMP_DIR"
}

trap cleanup EXIT INT TERM

if ! command -v qlmanage >/dev/null 2>&1; then
  echo "qlmanage is required to render the SVG on macOS." >&2
  exit 1
fi

if ! command -v sips >/dev/null 2>&1; then
  echo "sips is required to resize PNG assets on macOS." >&2
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required to pack favicon.ico." >&2
  exit 1
fi

qlmanage -t -s 1024 -o "$TMP_DIR" "$MASTER_SVG" >/dev/null 2>&1

if [ ! -f "$RENDERED_PNG" ]; then
  echo "Quick Look did not produce the expected PNG render." >&2
  exit 1
fi

sips -z 16 16 "$RENDERED_PNG" --out "$SCRIPT_DIR/favicon-16x16.png" >/dev/null
sips -z 32 32 "$RENDERED_PNG" --out "$SCRIPT_DIR/favicon-32x32.png" >/dev/null
sips -z 48 48 "$RENDERED_PNG" --out "$SCRIPT_DIR/favicon-48x48.png" >/dev/null
sips -z 180 180 "$RENDERED_PNG" --out "$SCRIPT_DIR/apple-touch-icon.png" >/dev/null
sips -z 192 192 "$RENDERED_PNG" --out "$SCRIPT_DIR/android-chrome-192x192.png" >/dev/null
sips -z 512 512 "$RENDERED_PNG" --out "$SCRIPT_DIR/android-chrome-512x512.png" >/dev/null

python3 - "$SCRIPT_DIR/favicon.ico" \
  "$SCRIPT_DIR/favicon-16x16.png" \
  "$SCRIPT_DIR/favicon-32x32.png" \
  "$SCRIPT_DIR/favicon-48x48.png" <<'PY'
import pathlib
import re
import struct
import sys

output = pathlib.Path(sys.argv[1])
inputs = [pathlib.Path(path) for path in sys.argv[2:]]
payloads = [path.read_bytes() for path in inputs]
offset = 6 + (16 * len(inputs))
entries = []

for path, payload in zip(inputs, payloads):
    match = re.search(r"(\d+)x(\d+)", path.name)
    if not match:
        raise SystemExit(f"Could not parse icon size from {path.name}")
    width = int(match.group(1))
    height = int(match.group(2))
    entries.append((width, height, len(payload), offset))
    offset += len(payload)

with output.open("wb") as handle:
    handle.write(struct.pack("<HHH", 0, 1, len(entries)))
    for width, height, length, start in entries:
        handle.write(
            struct.pack(
                "<BBBBHHII",
                0 if width >= 256 else width,
                0 if height >= 256 else height,
                0,
                0,
                1,
                32,
                length,
                start,
            )
        )
    for payload in payloads:
        handle.write(payload)
PY

echo "Generated favicon assets in $SCRIPT_DIR"
