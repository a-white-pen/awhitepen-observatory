/* Portfolio: television archive, references and award chips.
   Vanilla JS, no data fetching — the lanes below are the data. */
(function(){
/* thumbnails */
var T={
 wim3:"https://dam.mediacorp.sg/image/upload/s--rS79NIt1--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/image_8621.jpg?itok=jELE4Qe2",
 wim2:"https://prod98.togglestatic.com/shain/v1/dataservice/ResizeImage/$value?Format=%27jpg%27&Quality=85&ImageId=%277093060%27&EntityType=%27Item%27&EntityId=%2733309%27&Width=1280&Height=720",
 wim1:"https://dam.mediacorp.sg/image/upload/s--qWqONVYN--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/image_18394.jpg?itok=cnt2QZ2-",
 getreal:"https://dam.mediacorp.sg/image/upload/s--f4yITi3e--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/get-real--s17-ep-2_0.jpg?itok=9Vb56Gd3",
 getreal1:"https://dam.mediacorp.sg/image/upload/s--ZItTAxEG--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/get-real--s17-ep-1_0.jpg?itok=zxNsSqC4",
 regClass:"https://dam.mediacorp.sg/image/upload/s--TFdCKlnq--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/regardless-of-class-ep-thumbnail_1.jpg?itok=Skp-5Lg7",
 regRel:"https://dam.mediacorp.sg/image/upload/s--jClfjdyw--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/image_20672.jpg?itok=cATmrelK",
 icu:"https://dam.mediacorp.sg/image/upload/s--UqEzFiW0--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/image_61546.jpg?itok=IrwR-Ksi",
 icu4:"https://dam.mediacorp.sg/image/upload/s--tet_no3Y--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/image_61468.jpg?itok=o0T-2esZ",
 ffs:"https://dam.mediacorp.sg/image/upload/s--zIqwD0Oy--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/for-food-s-sake--2-ep-4-thumbnail.jpg?itok=7zDl_5k8",
 ffs3:"https://dam.mediacorp.sg/image/upload/s--WXGmTF5Q--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/for-food-s-sake--2-ep-3-thumbnail.png?itok=6kGuVgdZ",
 otrd:"https://dam.mediacorp.sg/image/upload/s--ke6qNcx9--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/on-the-red-dot-ep-12_0.jpg?itok=z6U492tt",
 otrd11:"https://dam.mediacorp.sg/image/upload/s---QluySRR--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/on-the-red-dot-ep-11_0.jpg?itok=GOtWIbu1",
 cfc:"https://dam.mediacorp.sg/image/upload/s--1VOJFmP---/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/ep-2_85.jpg?itok=WkoAVtqi",
 cfc1:"https://dam.mediacorp.sg/image/upload/s--Oh2XLjVU--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/ep-1_149.jpg?itok=kQPK9rSD",
 iot:"https://dam.mediacorp.sg/image/upload/s--4OIzhHJq--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/image_8067.jpg?itok=oJrsL622",
 iot5:"https://dam.mediacorp.sg/image/upload/s--tnmeExHy--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/image_7432.jpg?itok=XU4Ott95",
 dh:"https://dam.mediacorp.sg/image/upload/s--U5lB0PEC--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/ep-3_38.jpg?itok=W-Zman2s",
 dh2:"https://dam.mediacorp.sg/image/upload/s--oXI7wr_C--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/ep-2_59.png?itok=47bl7pBi",
 sw:"https://dam.mediacorp.sg/image/upload/s--B7Tx6RnV--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/secret-wars-ep-2_0.jpg?itok=6sPYwjLb",
 sw1:"https://dam.mediacorp.sg/image/upload/s--JXOskIkB--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/secret-wars-ep-1_0.jpg?itok=xD3DGXR5",
 kk:"https://dam.mediacorp.sg/image/upload/s--UfnIMmSz--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/ep-1_97.jpg?itok=Y8_3u7ER",
 cp:"https://dam.mediacorp.sg/image/upload/s--s2Y8XYt2--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/cyberpunk-d-ep-2-thumbnail_0.jpg?itok=zutEnZq0",
 cp1:"https://dam.mediacorp.sg/image/upload/s--28NpVYNH--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/image_9088.jpg?itok=W1dAb0p6",
 dh1:"https://dam.mediacorp.sg/image/upload/s--EuadX7Ub--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/ep-1_103.jpg?itok=7T4gULKB",
 cfcF:"https://dam.mediacorp.sg/image/upload/s--lGZSb0PS--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/climate-for-change-thumbnail.png?itok=iH7k35Mh",
 bhaF:"https://dam.mediacorp.sg/image/upload/s--DTzT5SUV--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/ep-1_106.png?itok=VURSN3BR",
 iotF:"https://dam.mediacorp.sg/image/upload/s--r01IGNFg--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/in-our-time-thumbnail.jpg?itok=zoc3hhV7",
 dhF:"https://dam.mediacorp.sg/image/upload/s--To1jymMl--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/disease-hunters-thumbnail.png?itok=faRuhXS7",
 swF:"https://dam.mediacorp.sg/image/upload/s--UnnL2vML--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/secret-wars-thumbnail.jpg?itok=nmVa9y-f",
 kkF:"https://dam.mediacorp.sg/image/upload/s--mMzA68zE--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/kampong-konkrit-thumbnail.jpg?itok=VpjAmrSq",
 fhF:"https://dam.mediacorp.sg/image/upload/s--1MCaKK73--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/forgotten-heroes-thumbnail.png?itok=uleGwdmL",
 cpF:"https://dam.mediacorp.sg/image/upload/s--TpWWnLyL--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/cyber-punk-d-thumbnail.png?itok=wGhgCpkm",
 wim3F:"https://dam.mediacorp.sg/image/upload/s--F1zbppWv--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/image_9442.jpg?itok=VAJmIkqu"
};
function ep(t,img){return {t:t,img:img};}
function epU(t,img,url,cta){return {t:t,img:img,url:url,cta:cta||'Watch'};}

/* lanes: each = array of {year, shows:[{st, img, aw?, url?, eps:[...]}]} — eps>1 expands, else links out */
var GCS="https://www.channelnewsasia.com/watch/game-changers-singapore/";
var GCS_EPS=[
 {t:"Ep 2: Bjorn Low",img:"https://dam.mediacorp.sg/image/upload/s--otQkojG8--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/image_23930.jpg?itok=s2p6Lnm4",url:GCS+"bjorn-low-1595761",cta:"Watch"},
 {t:"Ep 3: Kenny Leck",img:"https://dam.mediacorp.sg/image/upload/s--IoXESqmW--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/image_23931.jpg?itok=8iv5BaCD",url:GCS+"kenny-leck-1595766",cta:"Watch"},
 {t:"Ep 4: Jocelyn Chng",img:"https://dam.mediacorp.sg/image/upload/s--5vWmoXgl--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/image_23489.jpg?itok=49sjp_a3",url:GCS+"jocelyn-chng-1592271",cta:"Watch"},
 {t:"Ep 5: Lai Chang Wen",img:"https://dam.mediacorp.sg/image/upload/s--UoBP9tSd--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/image_23547.jpg?itok=V9UsLYNb",url:GCS+"lai-chang-wen-1592706",cta:"Watch"}
];
var BLUE=[
 {year:"2021",shows:[
   {st:"Climate For Change",img:T.cfcF,url:"https://www.channelnewsasia.com/watch/climate-for-change",eps:[epU("Refuelling Energy",T.cfc1,"https://www.channelnewsasia.com/watch/climate-change/refuelling-energy-1447846"),epU("Renewing Energy",T.cfc,"https://www.channelnewsasia.com/watch/climate-change/renewing-energy-1448451")]}
 ]},
 {year:"2020",shows:[
   {st:"Becoming Human — S2: Becoming Human Again",img:T.bhaF,url:"https://www.channelnewsasia.com/watch/becoming-human/becoming-human-again-1453946",eps:[]},
   {st:"In Our Time",img:T.iotF,url:"https://www.channelnewsasia.com/watch/in-our-time",eps:[epU("1960s: Singapore Boleh!","https://dam.mediacorp.sg/image/upload/s--EWbrrhKw--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/in-our-time--1960s_0.jpg?itok=bUnnBJVh","https://www.channelnewsasia.com/watch/our-time/1960s-singapore-boleh-1484881"),epU("The 1970s: Up, Up And Away!","https://dam.mediacorp.sg/image/upload/s--zBpKz3YS--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/in-our-time--1970s_0.jpg?itok=gCmVoWDA","https://www.channelnewsasia.com/watch/our-time/1970s-and-away-1485821"),epU("The 1980s: Count On Me, Singapore","https://dam.mediacorp.sg/image/upload/s--4OIzhHJq--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/image_8067.jpg?itok=oJrsL622","https://www.channelnewsasia.com/watch/our-time/1980s-count-me-singapore-1486181"),epU("The 1990s: Growing Up","https://dam.mediacorp.sg/image/upload/s--pGtls27e--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/in-our-time--1990s_0.jpg?itok=I3lHRF94","https://www.channelnewsasia.com/watch/our-time/1990s-growing-1486816"),epU("The 2000s: The Great Singapore Reboot","https://dam.mediacorp.sg/image/upload/s--tnmeExHy--/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/image_7432.jpg?itok=XU4Ott95","https://www.channelnewsasia.com/watch/our-time/2000s-great-singapore-reboot-1481216")]},
   {st:"Disease Hunters",img:T.dhF,url:"https://www.channelnewsasia.com/watch/disease-hunters",aw:1,awName:"WorldMediaFestivals 2021, intermedia-globe Silver — Documentaries: Research and Science",eps:[Object.assign(epU("The Viral Menace",T.dh1,"https://www.channelnewsasia.com/watch/disease-hunters/viral-menace-1456316"),{aw:1,awName:"The Impact DOCS Awards, Excellence Special Mention — Impact’s Top Ten"}),epU("Battle Against Bacteria",T.dh2,"https://www.channelnewsasia.com/watch/disease-hunters/disease-hunters-battle-against-bacteria-1456721"),Object.assign(epU("Mosquito Mayhem",T.dh,"https://www.channelnewsasia.com/watch/disease-hunters/mosquito-mayhem-1881221"),{aw:1,awName:"Cannes Corporate Media & TV Awards 2022, Silver — Science, Technology and Innovation"})]},
   {st:"Secret Wars",img:T.swF,url:"https://www.channelnewsasia.com/watch/secret-wars",eps:[epU("The Cybersecurity Dilemma",T.sw1,"https://www.channelnewsasia.com/watch/secret-wars/cybersecurity-dilemma-1480026"),epU("Conflict In Cyberspace",T.sw,"https://www.channelnewsasia.com/watch/secret-wars/conflict-cyberspace-1480891")]},
   {st:"Kampong Konkrit",img:T.kkF,url:"https://www.channelnewsasia.com/watch/kampong-konkrit/kampong-konkrit-1461291",eps:[]},
   {st:"Forgotten Heroes",img:T.fhF,url:"https://www.channelnewsasia.com/watch/forgotten-heroes-singapore-japanese-occupation/forgotten-heroes-1457406",aw:1,awName:"Cannes Corporate Media & TV Awards 2022, Gold — History and Personalities / Portraits",eps:[]}
 ]},
 {year:"2019",shows:[
   {st:"CyberPunk’D",img:T.cpF,url:"https://www.channelnewsasia.com/watch/cyberpunkd",eps:[epU("Phish Sticks And Microchips",T.cp1,"https://www.channelnewsasia.com/watch/cyberpunkd/phish-sticks-and-microchips-1492486"),{t:"Bits, Bytes And Bugs!",img:T.cp,url:"https://www.channelnewsasia.com/watch/cyberpunkd/bits-bytes-and-bugs-1487751",cta:"Watch",aw:1,awName:"New York Festivals 2021, Gold — Documentary: Science & Technology"}]}
 ]}
];
var ITF_IMG=function(i,e){return "https://prod98.togglestatic.com/shain/v1/dataservice/ResizeImage/$value?Format=%27jpg%27&Quality=85&ImageId=%27"+i+"%27&EntityType=%27Item%27&EntityId=%27"+e+"%27&Width=720&Height=405&ResizeAction=%27fill%27&HorizontalAlignment=%27center%27&VerticalAlignment=%27top%27";};
var ITF_EPS=[
 epU("Ep 1: Riding London’s Buses",ITF_IMG("5783922","58448"),"https://www.mewatch.sg/watch/IT-Figures-S5-E1-Riding-Londons-Buses-58448"),
 epU("Ep 3: Sleepless in Singapore",ITF_IMG("5712015","57889"),"https://www.mewatch.sg/watch/IT-Figures-S5-E3-Sleepless-in-Singapore-57889"),
 epU("Ep 4: Going Solo",ITF_IMG("5701158","57549"),"https://www.mewatch.sg/watch/IT-Figures-S5-E4-Going-Solo-57549"),
 epU("Ep 5: Wanted Bus Drivers",ITF_IMG("5689711","57239"),"https://www.mewatch.sg/watch/IT-Figures-S5-E5-Wanted-Bus-Drivers-57239"),
 epU("Ep 6: Stuck In Traffic",ITF_IMG("5747033","57135"),"https://www.mewatch.sg/watch/IT-Figures-S5-E6-Stuck-In-Traffic-57135"),
 epU("Ep 7: Litter Red Dot",ITF_IMG("5792653","57593"),"https://www.mewatch.sg/watch/IT-Figures-S5-E7-Litter-Red-Dot-57593"),
 epU("Ep 8: The Wealth Gap",ITF_IMG("5727125","57434"),"https://www.mewatch.sg/watch/IT-Figures-S5-E8-The-Wealth-Gap-57434"),
 epU("Ep 9: Gearing Up",ITF_IMG("5738341","57139"),"https://www.mewatch.sg/watch/IT-Figures-S5-E9-Gearing-Up-57139"),
 epU("Ep 10: Age Old Problem",ITF_IMG("5742410","56974"),"https://www.mewatch.sg/watch/IT-Figures-S5-E10-Age-Old-Problem-56974"),
 epU("Ep 11: The Better Bet?",ITF_IMG("5741886","56853"),"https://www.mewatch.sg/watch/IT-Figures-S5-E11-The-Better-Bet-56853"),
 epU("Ep 12: Swim To Win",ITF_IMG("5731520","56733"),"https://www.mewatch.sg/watch/IT-Figures-S5-E12-Swim-To-Win-56733")
];
var TSIMG=function(i,e){return "https://prod98.togglestatic.com/shain/v1/dataservice/ResizeImage/$value?Format=%27jpg%27&Quality=85&ImageId=%27"+i+"%27&EntityType=%27Item%27&EntityId=%27"+e+"%27&Width=1920&Height=1080";};
var TG=function(i,e,w,h){return "https://prod98.togglestatic.com/shain/v1/dataservice/ResizeImage/$value?Format=%27jpg%27&Quality=85&ImageId=%27"+i+"%27&EntityType=%27Item%27&EntityId=%27"+e+"%27&Width="+(w||1280)+"&Height="+(h||720);};
var DAM=function(sig,file,itok){return "https://dam.mediacorp.sg/image/upload/"+sig+"/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/"+file+"?itok="+itok;};
var SIG=[
 {year:"2019",shows:[
   {st:"Why It Matters — Season 3: The Plane Truth",img:T.wim3F,url:"https://www.channelnewsasia.com/watch/why-it-matters-cna/plane-truth-1494681",eps:[]},
   {st:"For Food’s Sake — Season 2",img:TG("5190631","32492"),eps:[epU("Ep 1: Fishballs & Squid",DAM("s--a0WBBbyq--","for-food-s-sake--2-ep-1-thumbnail_1.jpg","GkW_Xdd5"),"https://www.channelnewsasia.com/watch/foods-sake/fishballs-squid-1495096"),epU("Ep 2: Beansprouts & Potatoes",DAM("s--3FxGJlqX--","image_9654.jpg","loAhYBwR"),"https://www.channelnewsasia.com/watch/foods-sake/beansprouts-potatoes-1496366"),epU("Ep 3: Butter & Kailan",T.ffs3,"https://www.channelnewsasia.com/watch/foods-sake/butter-kailan-1496921"),epU("Ep 4: Pork & Corn",T.ffs,"https://www.channelnewsasia.com/watch/foods-sake/pork-corn-1497561")]},
   {st:"On The Red Dot: Chef Mission",img:TG("8348777","33333"),eps:[epU("Ep 1: Myanmar",DAM("s--zfSOejhP--","on-the-red-dot-ep-9_0.jpg","rPlPqu8D"),"https://www.channelnewsasia.com/watch/chef-mission-1-myanmar-1501261"),epU("Ep 3: Cambodia",T.otrd11,"https://www.channelnewsasia.com/watch/chef-mission-2-cambodia-1501281"),epU("Ep 4: Wales",T.otrd,"https://www.channelnewsasia.com/watch/chef-mission-2-wales-1503001")]},
   {st:"Get Real S17",img:TG("8148985","30607"),aw:1,awName:"New York Festivals 2020, Silver — Best News Documentary/Special",eps:[
     {t:"Ep 1: China’s Social Credit Lab",img:T.getreal1,url:"https://www.channelnewsasia.com/watch/chinas-social-credit-lab-1516351",cta:"Watch",aw:1,awName:"New York Festivals 2020, Silver — Best News Documentary/Special"},
     epU("Ep 2: The New Cyber Army",T.getreal,"https://www.channelnewsasia.com/watch/new-cyber-army-1509236"),
     epU("Ep 3: Never Be Home",DAM("s--rxTZ-PZm--","image_11818.jpg","UkKiHoIY"),"https://www.channelnewsasia.com/watch/never-be-home-1509656"),
     epU("Ep 6: School Gang Violence",DAM("s--opo-BtrE--","get-real--s17-ep-6_0.jpg","n2RtIfLL"),"https://www.channelnewsasia.com/watch/dying-graduate-1511241")
   ]}
 ]},
 {year:"2018",shows:[
   {st:"Why It Matters — Season 2",img:T.wim2,aw:1,awName:"New York Festivals 2020, Finalist — Documentary: Science & Technology",eps:[
     epU("Ep 2: Taking The Right Turn?",DAM("s--5iXUDIjU--","ep-2--taken-for-a-ride.png","FLf9zBNK"),"https://www.channelnewsasia.com/watch/why-it-matters-cna/taking-right-turn-1527346"),
     epU("Ep 3: Poverty: The Price & Perils",DAM("s--s_eX8her--","ep-3--poverty--the-price---perils_0.jpg","vrXwI1Cx"),"https://www.channelnewsasia.com/watch/why-it-matters-cna/poverty-price-perils-1528371"),
     epU("Ep 5: On The Menu - Blockchain (Part 1)",DAM("s--kxR7kW6---","ep-5--blockchain_0.png","EsWGesJa"),"https://www.channelnewsasia.com/watch/why-it-matters-cna/menu-blockchain-part-1-1524431"),
     epU("Ep 6: On The Menu - Blockchain (Part 2)",DAM("s--VtZTOJJo--","ep-6--blockchain_0.jpg","hU1YEMfG"),"https://www.channelnewsasia.com/watch/why-it-matters-cna/menu-blockchain-part-2-1524951"),
     epU("Ep 7: (Art)ificial Intelligence",DAM("s--n0AkVx2w--","ep-7---art-ificial-intelligence_0.jpg","HLJPBDJj"),"https://www.channelnewsasia.com/watch/why-it-matters-cna/artificial-intelligence-1525451"),
     epU("Ep 9: Losing Yourself",TSIMG("6474763","63659"),"https://www.channelnewsasia.com/watch/why-it-matters-cna/losing-yourself-2053911"),
     {t:"Ep 10: Face Off",img:DAM("s--eE0pUdCS--","image_13135.jpg","Y0zMtQn2"),url:"https://www.channelnewsasia.com/watch/why-it-matters-cna/face-1521281",cta:"Watch",aw:1,awName:"New York Festivals 2020, Finalist — Documentary: Science & Technology"}
   ]},
   {st:"Inside The Children’s ICU",img:DAM("s--wrPaF5gc--","inside-the-children-s-icu-thumbnail.jpg","oChuQzdx"),eps:[epU("Ep 1: Life And Death",DAM("s--kyUVnXZi--","image_18510.jpg","Be7YiPrL"),"https://www.channelnewsasia.com/watch/inside-childrens-icu/life-and-death-1561451"),epU("Ep 2: Staying Strong",DAM("s--BqHXc-UJ--","image_18621.jpg","xtaWNpaO"),"https://www.channelnewsasia.com/watch/inside-childrens-icu/staying-strong-1562061"),epU("Ep 3: Critical Decisions",DAM("s--UgXTj230--","image_18625.jpg","C3MIluMd"),"https://www.channelnewsasia.com/watch/inside-childrens-icu/critical-decisions-1562081"),epU("Ep 4: Facing Death",T.icu4,"https://www.channelnewsasia.com/watch/inside-childrens-icu/facing-death-1861301"),epU("Ep 5: Road To Recovery",T.icu,"https://www.channelnewsasia.com/watch/inside-childrens-icu/road-recovery-1861776")]},
   {st:"Regardless of Class",img:T.regClass,url:"https://www.channelnewsasia.com/watch/regardless-of/class-1535171",aw:1,awName:"New York Festivals 2019, Bronze — Documentary: Editorial/Viewpoint",eps:[]},
   {st:"Get Real S16",img:TG("6056503","31960"),aw:1,awName:"New York Festivals 2019, Finalist — Best Coverage of Continuing News Story",eps:[
     {t:"Ep 1: Escape From Marawi",img:DAM("s--BW4QF9Wm--","image_19137.jpg","dC0jtHp7"),url:"https://www.channelnewsasia.com/watch/escape-marawi-1564761",cta:"Watch",aw:1,awName:"New York Festivals 2019, Finalist — Best Coverage of Continuing News Story"},
     epU("Ep 5: China’s Forgotten Heroes",TG("5040870","74927"),"https://www.channelnewsasia.com/watch/chinas-forgotten-heroes-1560851"),
     epU("Ep 8: Digital Detectives (Singapore)",TG("5716907","48650"),"https://www.channelnewsasia.com/watch/digital-detectives-1860526")
   ]}
 ]},
 {year:"2017",shows:[
   {st:"Regardless Of Religion",img:T.regRel,url:"https://www.channelnewsasia.com/watch/regardless-of/religion-1574381",aw:1,awName:["WorldMediaFestivals 2018, intermedia-globe Silver — Documentaries: Ethics and Religion","AIB Awards 2018, Shortlisted — Domestic Affairs Documentary","New York Festivals, Silver"],eps:[]},
   {st:"Why It Matters — Season 1",img:TG("5998164","30751"),aw:1,awName:"Asian Academy Creative Awards 2018, Singapore National Winner — Best Infotainment Programme",eps:[
     epU("Ep 1: Ready, Get Set, Go Cashless",DAM("s--zUNyXGYo--","image_19860.jpg","qiiRzn3p"),"https://www.channelnewsasia.com/watch/why-it-matters-cna/ready-get-set-go-cashless-1569656"),
     epU("Ep 2: What’s In Our Pools?",TSIMG("5703469","72681"),"https://www.channelnewsasia.com/watch/why-it-matters-cna/whats-our-pools-1570396"),
     epU("Ep 3: Can E-Learning Make You Dumb?",DAM("s--mXgMH2ld--","image_19168.jpg","h_Tfu-9c"),"https://www.channelnewsasia.com/watch/why-it-matters-cna/can-e-learning-make-you-dumb-1564921"),
     epU("Ep 4: More Than Sad",DAM("s--gZTKg2Nt--","image_19298.jpg","5bDjSsIr"),"https://www.channelnewsasia.com/watch/why-it-matters-cna/more-sad-1566126"),
     epU("Ep 6: Give Me More Time Off",DAM("s--RK9PbGal--","image_18695.jpg","uNW3_Gg2"),"https://www.channelnewsasia.com/watch/why-it-matters-cna/give-me-more-time-1562466"),
     epU("Ep 7: Filthy Rich",DAM("s--gwBuPRK4--","image_18700.jpg","1abN7h5X"),"https://www.channelnewsasia.com/watch/why-it-matters-cna/filthy-rich-1562491"),
     epU("Ep 9: How Estonia Became Tomorrowland",DAM("s--e7zn3Gmh--","image_19029.jpg","1BZgNTua"),"https://www.channelnewsasia.com/watch/why-it-matters-cna/how-estonia-became-tomorrowland-1564191"),
     epU("Ep 10: When Lightning Strikes",DAM("s--kMZJOcuV--","image_18260.jpg","3Hhz_Gal"),"https://www.channelnewsasia.com/watch/why-it-matters-cna/when-lightning-strikes-1559431"),
     epU("Ep 11: Charity 2.0",TSIMG("5740878","74984"),"https://www.channelnewsasia.com/watch/why-it-matters-cna/charity-20-1559441"),
     epU("Ep 12: Man Made",TG("5040906","74778"),"https://www.channelnewsasia.com/watch/why-it-matters-cna/man-made-1560791")
   ]},
   {st:"Get Real S15",img:TG("7092900","32020"),aw:1,awName:"Asian Television Awards 2017, Nominee — Best Documentary Series",eps:[
     {t:"Inside Pakistan’s Madrasahs",img:"https://static.wixstatic.com/media/834ce6_0f15e91ef80942e4a95fc63ece77bc5c~mv2.png"},
     {t:"Ep 7: The Long Wait",img:TG("5444868","47533"),url:"https://www.mewatch.sg/watch/Get-Rea-S15-E7-The-Long-Wait-47533",cta:"Watch"}
   ]},
   {st:"Tony Tan: A President’s Journey",img:"https://i.ytimg.com/vi/n0YMXocdj4k/maxresdefault.jpg",url:"https://www.mewatch.sg/watch/Tony-Tan-A-Presidents-Journey-E1-73772",eps:[]},
   {st:"Game Changers Singapore",img:DAM("s--zhCHLSln--","singapore-game-changers-thumbnail.jpg","6N-WiC5G"),eps:GCS_EPS}
 ]},
 {year:"2016",shows:[
   {st:"IT Figures",img:"https://prod98.togglestatic.com/shain/v1/dataservice/ResizeImage/$value?Format=%27jpg%27&Quality=85&ImageId=%277092721%27&EntityType=%27Item%27&EntityId=%2731500%27&Width=720&Height=405&ResizeAction=%27fill%27&HorizontalAlignment=%27center%27&VerticalAlignment=%27top%27",eps:ITF_EPS},
   {st:"Regardless Of Race",img:DAM("s--vuZ5tawA--","image_27153.jpg","yHfoitm3"),url:"https://www.channelnewsasia.com/watch/regardless-of/race-1614386",aw:1,awName:"Documentary of the Year, Mediacorp News Awards",eps:[]},
   {st:"The Mediacorp Experience",img:"https://i.ytimg.com/vi/LiCOuE6pLUg/maxresdefault.jpg",url:"https://www.youtube.com/embed/LiCOuE6pLUg?start=51",eps:[]},
   {st:"Shaun Seow (CEO)’s farewell video",img:"https://dam.mediacorp.sg/image/upload/s--AqIGzrCM--/c_fill,g_center,h_598,w_747/f_auto,q_auto/v1/tdy-migration/shaun_seow.jpg?itok=Fxrsb067",url:"https://www.channelnewsasia.com/singapore/mediacorp-ceo-shaun-seow-steps-down-search-successor-commences-5762506",eps:[]}
 ]}
];

/* National Affairs — CNA Budget programmes */
var RECENT=[
 {st:"Singapore Budget 2022: What It Means For You",img:"https://i.ytimg.com/vi/oyfV9CBd-V8/hqdefault.jpg",url:"https://www.youtube.com/watch?v=oyfV9CBd-V8",eps:[]},
 {st:"Singapore Budget 2022 forum: Ask The Finance Minister",img:"https://i.ytimg.com/vi/NrhmzyzVwrU/hqdefault.jpg",url:"https://www.youtube.com/watch?v=NrhmzyzVwrU",eps:[]}
];
var NATGEO=[
 {st:"In Search of the Straits Born",img:"https://hype.my/wp-content/uploads/2016/07/program1.webp",url:"https://www.natgeotv.com/uk/shows/natgeo/in-search-of-the-straits-born-with-julian-davison",eps:[]},
 {st:"Portraits of the Peranakan",img:"https://hype.my/wp-content/uploads/2016/07/13823611_10153931709773090_895200021_n.webp",url:"https://hype.my/aperanakanheritage-5-things-you-should-know-about-the-peranakans/",eps:[]}
];
var XCTT=TSIMG("7092558","100309");
var XRITES=TSIMG("8347486","33490");
var XTREME=[
 {st:"《城市隐身人》 · In the Shadows",img:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgogsU9b8bkUOYEa3tiq8UbeS575GvhRu7DnfT8_V2b8v9gbVISVnl93RHmXuDW-8CDc_EEZpYMQlt-V9NNdT1qL4a4tTNkiYnCzMguYKDOQjKo78qOe0Wk2tSnVSGCq58umb08t4IyBv0/s1600/10300323_10152953013298831_3697651449695042854_n.jpg",url:"https://www.bukitbrown.org/2018/11/jia-le-channel-ep-2-tomb-hunters.html",eps:[]},
 {st:"City Time Traveller 2",img:XCTT,aw:1,awName:"New York Festivals 2017, Finalist Certificate — Documentary/Information Program: Cultural Issues",blurb:"Jason Pomeroy travels across six Asian destinations, using architecture to uncover their colonial, cultural and spiritual histories.",eps:[
   {t:"Ep 1: Manila",sub:"Spain’s Bastion in the East",x:"Jason explores Intramuros, Manila’s historic walled city, looking at the architectural legacy of Spanish colonial rule.",img:TSIMG("5045867","103014"),url:"https://www.mewatch.sg/watch/City-Time-Traveller-S2-E1-Manila-Spains-Bastion-In-The-Beast-103014"},
   {t:"Ep 2: Kolkata",sub:"The Legacy of British India",x:"Jason explores Kolkata through sites including Howrah Railway Station, the Oberoi Grand Hotel and College Street, examining the architectural and cultural legacy of the British Raj.",img:TSIMG("5045859","103015"),url:"https://www.mewatch.sg/watch/City-Time-Traveller-S2-E2-Kolkata-The-Legacy-of-British-India-103015"},
   {t:"Ep 3: Kuala Lumpur",sub:"The Search for Malaysian Architecture",x:"Jason examines how Kuala Lumpur’s architecture expresses Malaysian identity and the influence of Islam on modern Malaysian design.",img:TSIMG("5045862","103013"),url:"https://www.mewatch.sg/watch/City-Time-Traveller-S2-E3-Kuala-Lumpur-The-Search-For-Malaysian-Architecture-103013"},
   {t:"Ep 4: Amritsar",sub:"The Land of the Sikhs",x:"Jason visits Amritsar and the Golden Temple, exploring Sikh architecture, spirituality and the history surrounding Guru Nanak.",img:TSIMG("5045861","103012"),url:"https://www.mewatch.sg/watch/City-Time-Traveller-S2-E4-Amritsar-The-Land-Of-The-Sikhs-103012"},
   {t:"Ep 5: Shanghai",sub:"China’s Bridge to the World",x:"Jason explores Shanghai’s architectural evolution and financial skyline as expressions of the city’s global ambitions.",img:TSIMG("5732078","103016"),url:"https://www.mewatch.sg/watch/City-Time-Traveller-S2-E5-Shanghai-Chinas-Bridge-To-The-World-103016"},
   {t:"Ep 6: Paro, Bhutan",sub:"The Spiritual in the Secular",x:"Jason explores Paro’s traditional architecture and the relationship between spirituality, domestic life and modernisation in Bhutan.",img:TSIMG("5721463","103011"),url:"https://www.mewatch.sg/watch/City-Time-Traveller-S2-E6-Bhutan-The-Spiritual-In-The-Secular-103011"}
 ]},
 {st:"Rites of Motherhood",img:XRITES,blurb:"Exploring childbirth and motherhood traditions across Asia, from Taiwan and Cambodia to Bali, Malaysia, India and Japan.",eps:[
   epU("Ep 1: Malaysia",TSIMG("5725542","51254"),"https://www.mewatch.sg/watch/Rites-of-Motherhood-E1-51254"),
   epU("Ep 2: Taiwan",TSIMG("5681682","51245"),"https://www.mewatch.sg/watch/Rites-of-Motherhood-E2-51245"),
   epU("Ep 3: Kyoto, Japan",TSIMG("5749267","51242"),"https://www.mewatch.sg/watch/Rites-of-Motherhood-E3-51242"),
   epU("Ep 4: Bali, Indonesia",TSIMG("5747018","51246"),"https://www.mewatch.sg/watch/Rites-of-Motherhood-E4-51246"),
   epU("Ep 5: India",TSIMG("5776978","51244"),"https://www.mewatch.sg/watch/Rites-of-Motherhood-E5-51244"),
   epU("Ep 6: Cambodia",TSIMG("5798590","51243"),"https://www.mewatch.sg/watch/Rites-of-Motherhood-E6-51243")
 ]}
];

var TROPHY='<svg viewBox="0 0 24 24"><path d="M7 4h10v4a5 5 0 0 1-10 0V4z"/><path d="M7 6H4.2v1A3 3 0 0 0 7 10M17 6h2.8v1A3 3 0 0 1 17 10M9.5 15h5M8.5 19.2h7M12 14v1.2"/></svg>';
var CHEV='<svg viewBox="0 0 24 24"><path d="M5 9l7 7 7-7"/></svg>';
var ARROW='<svg viewBox="0 0 24 24"><path d="M7 17L17 7M8 7h9v9"/></svg>';
function im(src,alt){return '<img class="mediaimg" src="'+src+'" alt="'+(alt||'')+'" loading="lazy" referrerpolicy="no-referrer">';}
function awc(s){if(!s.aw)return '';var n=Array.isArray(s.awName)?s.awName.join(' · '):s.awName;return '<span class="awc'+(n?' awc--has':'')+'">'+TROPHY+'<span class="awc__lbl">Award-winning</span>'+(n?'<span class="awc__won"><span class="awc__wonin">'+n+'</span></span>':'')+'</span>';}
function card(s,y,i){
  var exp=s.eps&&s.eps.length>1;
  var media=s.img?im(s.img,s.alt):'<span class="lc__ph"></span>'+(s.phLabel?'<span class="lc__phtag">'+s.phLabel+'</span>':'');
  var go=(!exp&&s.url)?'<span class="lc__go">'+ARROW+'</span>':'';
  var inner='<span class="lc__m">'+media+'</span><span class="lc__scrim"></span>'+awc(s)+
    '<span class="lc__b"><span class="lc__t">'+s.st+'</span>'+
    (exp?'<span class="lc__ex">'+s.eps.length+' episodes '+CHEV+'</span>':'')+'</span>'+go;
  if(exp)return '<button class="lc" data-y="'+y+'" data-i="'+i+'">'+inner+'</button>';
  if(s.url)return '<a class="lc" href="'+s.url+'" target="_blank" rel="noopener">'+inner+'</a>';
  return '<div class="lc lc--static">'+inner+'</div>';
}
function ecard(e){
  var media=e.img?im(e.img):'<span class="lc__ph"></span>'+(e.phLabel?'<span class="lc__phtag">'+e.phLabel+'</span>':'');
  var sub=e.sub?'<span class="ec__sub">'+e.sub+'</span>':'';
  var go=e.url?'<span class="lc__go">'+ARROW+'</span>':'';
  var inner='<span class="lc__m">'+media+'</span><span class="lc__scrim"></span>'+awc(e)+go+'<span class="lc__b"><span class="lc__t">'+e.t+sub+'</span></span>';
  return e.url?'<a class="lc" href="'+e.url+'" target="_blank" rel="noopener">'+inner+'</a>':'<div class="lc lc--static">'+inner+'</div>';
}
function panelHTML(s){
  var grid='<div class="ygrid">'+s.eps.map(ecard).join('')+'</div>';
  return '<div class="ypanel__hd"><span class="ypanel__t">'+s.st+'</span><span class="ypanel__n">'+s.eps.length+' episodes</span><button class="ypanel__x" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'+
  '<div class="ypanel__grid">'+grid+'</div>';
}
function renderLane(key,data){
  var host=document.querySelector('[data-lane="'+key+'"]');if(!host)return;
  host.innerHTML=data.map(function(g,yi){
    return '<div class="yr"><div class="yearhead">'+g.year+'</div><div class="ygrid">'+
      g.shows.map(function(s,i){return card(s,yi,i);}).join('')+
      '</div><div class="ypanel" data-panel="'+key+'-'+yi+'"></div></div>';
  }).join('');
  host.addEventListener('click',function(e){
    var btn=e.target.closest('.lc');if(!btn||btn.tagName!=='BUTTON'||!btn.hasAttribute('data-y'))return;
    var yi=+btn.getAttribute('data-y'),i=+btn.getAttribute('data-i'),s=data[yi].shows[i];
    var panel=host.querySelector('[data-panel="'+key+'-'+yi+'"]');
    var yr=btn.closest('.yr');
    var wasActive=btn.classList.contains('active');
    yr.querySelectorAll('.lc').forEach(function(b){b.classList.remove('active');});
    if(wasActive){panel.classList.remove('open');panel.innerHTML='';return;}
    btn.classList.add('active');
    panel.innerHTML=panelHTML(s);
    panel.classList.add('open');
    panel.querySelector('.ypanel__x').addEventListener('click',function(){panel.classList.remove('open');panel.innerHTML='';btn.classList.remove('active');});
  });
}
/* a folder card inherits the awards of the episodes inside it */
function rollupAwards(list){list.forEach(function(n){(n.shows||[n]).forEach(function(s){if(!s||!s.eps||!s.eps.length)return;var names=(s.aw&&s.awName)?[].concat(s.awName):[];s.eps.forEach(function(e){if(e&&e.aw&&e.awName)[].concat(e.awName).forEach(function(x){if(names.indexOf(x)<0)names.push(x);});});if(names.length){s.aw=1;s.awName=names;}});});}
[RECENT,BLUE,SIG,NATGEO,XTREME].forEach(rollupAwards);
renderLane('recent',[{year:"2022",shows:RECENT}]);renderLane('blue',BLUE);renderLane('sig',SIG);
function renderFlat(key,shows){
  var host=document.querySelector('[data-lane="'+key+'"]');if(!host)return;
  host.innerHTML='<div class="ygrid">'+shows.map(function(s,i){return card(s,0,i);}).join('')+'</div><div class="ypanel" data-panel="'+key+'"></div>';
  var panel=host.querySelector('[data-panel="'+key+'"]');
  host.addEventListener('click',function(e){
    var btn=e.target.closest('.lc');if(!btn||btn.tagName!=='BUTTON')return;
    var i=+btn.getAttribute('data-i'),s=shows[i],wasActive=btn.classList.contains('active');
    host.querySelectorAll('.lc').forEach(function(b){b.classList.remove('active');});
    if(wasActive){panel.classList.remove('open');panel.innerHTML='';return;}
    btn.classList.add('active');panel.innerHTML=panelHTML(s);panel.classList.add('open');
    panel.querySelector('.ypanel__x').addEventListener('click',function(){panel.classList.remove('open');panel.innerHTML='';btn.classList.remove('active');});
  });
}
renderFlat('natgeo',NATGEO);renderFlat('xtreme',XTREME);

/* long chapters open with their first paragraphs; Continue reveals the rest */
document.querySelectorAll('.portfolio .prose').forEach(function(pr){
  if(pr.querySelectorAll('p').length<=4)return;
  pr.classList.add('fold');pr.setAttribute('data-open','0');
  var b=document.createElement('button');b.className='more';b.type='button';b.setAttribute('data-open','0');
  b.innerHTML='Continue '+CHEV;
  pr.parentNode.insertBefore(b,pr.nextSibling);
  b.addEventListener('click',function(){
    var o=pr.getAttribute('data-open')==='1'?'0':'1';
    pr.setAttribute('data-open',o);b.setAttribute('data-open',o);
    b.innerHTML=(o==='1'?'Less ':'Continue ')+CHEV;
    if(o==='0')window.scrollTo({top:pr.getBoundingClientRect().top+window.pageYOffset-120,behavior:'smooth'});
  });
});
})();

/* References — third-party evidence attached to the claim it supports. */
(function(){
var REFS={
 heymax:[{
   q:['Belinda demonstrated <b>passion, curiosity, and the ability to work independently</b> in a fast-changing startup environment… She delivered several impactful projects, including <b>improving our data quality, setting up our Airflow instance, building classifiers, and developing recommendation models</b>… Her <b>resourcefulness and drive</b> helped improve our data quality and deepened our understanding of both our business and our users.'],
   who:'Sean Dy, Co-founder & COO, heymax.ai',
   img:'https://media.awhitepen.com/portfolio/references/recommendation-sean-dy.webp', kind:'li'
 }],
 corporate:[{
   q:['Belinda is <b>one of the most thorough, organized and reliable researchers I have worked with</b>… Belinda also has <b>excellent technical capabilities</b> (e.g., SPSS, Python, data visualization/dashboarding techniques, statistical analysis)…'],
   who:'Kate Hendricks, Research Leader',
   img:'https://media.awhitepen.com/portfolio/references/recommendation-kate-hendricks.webp', kind:'li'
 },{
   q:['Belinda is a <b>tremendous researcher</b>… a <b>‘roll-up your sleeves’ work ethic</b>, a knowledgeable and thoughtful point of view as well as a keen eye for detail… She is a <b>solution oriented thinker</b>… Belinda is a <b>huge asset to any team, as a team player, collaborator, and reliable researcher</b>.'],
   who:'Meghann Elrhoul, MBA, MSc',
   img:'https://media.awhitepen.com/portfolio/references/recommendation-meghann-elrhoul.webp', kind:'li'
 }],
 bluechip:[{
   q:['I know Belinda to be a <b>highly intelligent, resourceful and hardworking employee,</b> who is <b>committed to achieving the best results in her work</b>… Her research… is <b>critical to writer/producers</b>, who depend on it to develop their stories… <b>CNA’s Documentaries Team consistently wins a number of prestigious international industry awards every year. Many of these successes could not have been possible without Ms Wan’s outstanding research-gathering efforts, and valuable creative inputs to writer/producers.</b>'],
   who:'Deputy Chief Editor, CNA / Mediacorp',
   img:'https://media.awhitepen.com/portfolio/references/cna-deputy-chief-editor-letter.webp', kind:'letter'
 }],
 signatures:[{
   q:['Belinda is <b>meticulous in research work and never allowed story to take precedence over facts</b>. She is <b>good with numbers</b> and has provided interesting insights that added value to the shows we collaborated on… she has also proven herself to be <b>resourceful in approaching and booking suitable profiles</b>…'],
   who:'Elrica Tanu, Founder, Comma Cut',
   img:'https://media.awhitepen.com/portfolio/references/recommendation-elrica-tanu.webp', kind:'li'
 }],
 xtreme:[{
   q:['Belinda assisted me for 3 different TV Series that were in various stages of production… she has <b>proven to be intelligent and resourceful in her role</b>. At all times I have found Belinda to be <b>reliable and hardworking</b>… I consider her to be a valuable production member in my team.'],
   who:'Supervising Producer/Director, Xtreme Media Pte Ltd',
   img:'https://media.awhitepen.com/portfolio/references/xtreme-supervising-producer-letter.webp', kind:'letter'
 }]
};
var LI='https://www.linkedin.com/in/belinda-wan';
var OUT='<svg viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"></path></svg>';
var KICKER='What people who worked with B say';
function refHTML(r,key,i){
  var act=r.kind==='letter'?'View reference letter':'View on LinkedIn';
  return '<figure class="ref" data-ref="'+key+'-'+i+'">'+
    '<blockquote class="ref__q">'+r.q.map(function(p){return '<p>“'+p+'”</p>';}).join('')+'</blockquote>'+
    '<figcaption class="ref__f">'+
      '<button class="ref__t'+(r.kind==='li'?' ref__t--li':'')+'" type="button" data-open="'+key+'-'+i+'" aria-label="View the source"><img src="'+r.img+'" alt="" loading="lazy"></button>'+
      '<span class="ref__m"><span class="ref__w">'+r.who+'</span>'+
      (r.kind==='letter'
        ? '<button class="ref__go" type="button" data-open="'+key+'-'+i+'">'+act+' '+OUT+'</button>'
        : '<a class="ref__go" href="'+LI+'" target="_blank" rel="noopener">'+act+' '+OUT+'</a>')+
      '</span>'+
    '</figcaption></figure>';
}
var all={};
document.querySelectorAll('.refs[data-refs]').forEach(function(host){
  var key=host.getAttribute('data-refs'),list=REFS[key];if(!list)return;
  host.innerHTML='<div class="refs__k">'+KICKER+'</div>'+list.map(function(r,i){all[key+'-'+i]=r;return refHTML(r,key,i);}).join('');
});
/* claim ↔ receipt: hovering or focusing either one tints the other */
document.querySelectorAll('.rmk[data-rmk]').forEach(function(mk){
  var key=mk.getAttribute('data-rmk');
  var block=document.querySelector('.refs[data-refs="'+key+'"]');if(!block)return;
  var refs=block.querySelectorAll('.ref');
  function set(on){mk.classList.toggle('lit',on);refs.forEach(function(r){r.classList.toggle('lit',on);});}
  mk.addEventListener('mouseenter',function(){set(true);});
  mk.addEventListener('mouseleave',function(){set(false);});
  refs.forEach(function(r){
    r.addEventListener('mouseenter',function(){mk.classList.add('lit');});
    r.addEventListener('mouseleave',function(){mk.classList.remove('lit');});
  });
});
/* source viewer */
var box=document.createElement('div');
box.className='rbox';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Reference source');
box.innerHTML='<div class="rbox__w"><div class="rbox__hd"><span class="rbox__ti" data-t></span><button class="rbox__x" type="button" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"></path></svg></button></div><div class="rbox__b"><img alt="" data-img></div><div class="rbox__ft"><span class="rbox__n" data-n></span><span data-a></span></div></div>';
document.body.appendChild(box);
var bImg=box.querySelector('[data-img]'),bTi=box.querySelector('[data-t]'),bN=box.querySelector('[data-n]'),bA=box.querySelector('[data-a]');
function open(id){
  var r=all[id];if(!r)return;
  bImg.src=r.img;bTi.textContent=r.who;
  bN.textContent=r.kind==='letter'?'Full reference & referee details available upon request.':'';
  bA.innerHTML=r.kind==='letter'?'':'<a class="ref__go" href="'+LI+'" target="_blank" rel="noopener">View on LinkedIn '+OUT+'</a>';
  box.classList.add('open');box.querySelector('.rbox__x').focus();
}
function close(){box.classList.remove('open');bImg.removeAttribute('src');}
document.addEventListener('click',function(e){
  var t=e.target.closest('[data-open]');if(t){open(t.getAttribute('data-open'));return;}
  if(e.target===box||e.target.closest('.rbox__x'))close();
});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&box.classList.contains('open'))close();});
})();
/* award chip: scroll long award names horizontally on hover */
(function(){
  var timer;
  function stop(w){if(!w)return;clearTimeout(timer);w.classList.remove('is-marq');w.style.removeProperty('--aw-ov');w.style.removeProperty('--aw-dur');}
  document.addEventListener('pointerover',function(e){
    var card=e.target.closest&&e.target.closest('.lc');if(!card)return;
    var w=card.querySelector('.awc__won');if(!w)return;
    clearTimeout(timer);
    timer=setTimeout(function(){
      var ov=w.scrollWidth-w.clientWidth;
      if(ov>2){w.style.setProperty('--aw-ov',ov+'px');w.style.setProperty('--aw-dur',Math.min(40,Math.max(5,ov/18))+'s');w.classList.add('is-marq');}
    },380);
  });
  document.addEventListener('pointerout',function(e){
    var card=e.target.closest&&e.target.closest('.lc');if(!card)return;
    if(e.relatedTarget&&card.contains(e.relatedTarget))return;
    stop(card.querySelector('.awc__won'));
  });
})();
