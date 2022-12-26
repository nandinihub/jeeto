// var express = require("express");
// var app = express();
// var port = 8080;
// var bodyParser = require('body-parser');
// app.use(bodyParser.json());
// var mongoose = require("mongoose");

// mongoose.connect("mongodb://127.0.0.1:27017/mydb");
// var nameSchema = new mongoose.Schema({
//     type: String,
    
// )};

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/mydb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
    //   var rulesData = [
    //      {_id : 1 , p: "By downloading or using the app, these terms will automatically apply to you - you should make sure therefore that you read them carefully before using the app. You're not allowed to copy, or modify the app, any part of the app, or our trademarks in any way. You're not allowed to attempt to extract the source code of the app, and you also shouldn't try to translate the app into other languages, or make derivative versions. The app itself, and all the trade marks, copyright, database rights and other intellectual property rights related to it, still belong to Jeeto Gyan Se."},
    //      {_id : 2 , p: "Jeeto Gyan se is committed to ensuring that the app is as useful and efficient as possible. For that reason, we reserve the right to make changes to the app or to charge for its services, at any time and for any reason. We will never charge you for the app or its services without making it very clear to you exactly what you're paying for."},
    //      {_id : 3 , p: "Jeeto Gyan Se stores and processes personal data that you have provided to us, in order to provide our service. It's your responsibility to keep your phone and access to the app secure. We therefore recommend that you do not jailbreak or root your phone, which is the process of removing software restrictions and limitations imposed by the official operating system of your device. It could make your phone vulnerable to malware/viruses/malicious programs, compromise your phone's security features and it could mean that Jeeto Gyan Se won't work properly or at all."},
    //      {_id : 4 , p: "You should be aware that there are certain things that Jeeto Gyan Se will not take responsibility for. Certain functions of the app will require the app to have an active internet connection. The connection can be Wi-Fi, or provided by your mobile network provider, but Jeeto Gyan Se cannot take responsibility for the app not working at full functionality if you don't have access to Wi-Fi, and you don't have any of your data allowance left."},
    //      {_id : 5 , p: "If you're using the app outside of an area with Wi-Fi, you should remember that your terms of the agreement with your mobile network provider will still apply. As a result, you may be charged by your mobile provider for the cost of data for the duration of the connection while accessing the app, or other third party charges. In using the app, you're accepting responsibility for any such charges, including roaming data charges if you use the app outside of your home territory (i.e. region or country) without turning off data roaming."},
    //      {_id : 6 , p: "Along the same lines, Jeeto Gyan Se cannot always take responsibility for the way you use the app i.e. You need to make sure that your device stays charged - if it runs out of battery and you can't turn it on to avail the Service, Jeeto Gyan Se cannot accept responsibility."},
    //      {_id : 7 , p: "With respect to Jeeto Gyan Se responsibility for your use of the app, when you're using the app, it's important to bear in mind that although we endeavour to ensure that it is updated and correct at all times, we do rely on third parties to provide information to us so that we can make it available to you. Jeeto Gyan Se accepts no liability for any loss, direct or indirect, you experience as a result of relying wholly on this functionality of the app."},
    //      {_id : 8 , p: "At some point, we may wish to update the app. The app is currently available on Android and iOS - the requirements for both systems (and for any additional systems we decide to extend the availability of the app to) may change, and you'll need to download the updates if you want to keep using the app. Jeeto Gyan Se does not promise that it will always update the app so that it is relevant to you and/or works with the iOS/Android version that you have installed on your device. However, you promise to always accept updates to the application when offered to you, We may also wish to stop providing the app, and may terminate use of it at any time without giving notice of termination to you. Unless we tell you otherwise, upon any termination, (a) the rights and licenses granted to you in these terms will end; (b) you must stop using the app, and (if needed) delete it from your device."},
    //      {_id : 9 , p: "Changes to This Terms and Conditions "},
    //      {_id : 10 , p: "We may update our terms and conditions from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new terms and tonditions on this page."},
    //      {_id : 11 , p: "These changes are effective immediately after they are posted on this page. "},
    //      {_id : 12 , p: "Contact Us "},
    //      {_id : 13 , p: "If you have any questions or suggestions about these terms and conditions, do not hesitate to contact us."}
    // ];
  var rules = [
            {_id : 1 , rule : "Contestants will be provided 8 subjects to choose from i.e., History, Geography, Sports, Political Science, Economics, Sociology, Environmental Science and General Science."},
            {_id : 2 , rule : "Each subject will contain 5 questions."},
            {_id : 3 , rule : "Total time limit of 100 seconds has been given for 5 questions."},
            {_id : 4 , rule : "Crossing the time limit will lead to the submission of test."},
            {_id : 5 , rule : "Answering all 5 questions right will only be considered as winner."},
            {_id : 6 , rule : "The lesser the time taken to answer, the more the chances of winning."},
            {_id : 7 , rule : "Only 3 winners whose answer time is the lowest will be shown in winnerlist."},
            {_id : 8 , rule : "If the contestant press 'back' or 'home' or 'recents' buttons in between the game, the contestant will not be allowed to enter the game again in the same slot and the test will automatically be submitted."},
            {_id : 9 , rule : "Game time of all the slots will only be available for half an hour."},
            {_id : 10, rule : "If any screen changes occurs during the game, the test will automatically be submitted."}
        ];

//    var myobj = [
//     { _id:1, sub_id:1, sub: 'History', questions: 'Which one of the following ancient towns is well known for its elaborate system of water harvesting and management by building a series of dams and channelising water into connected reservoirs?', option1:"Dholavira", option2:"Kalibangan", option3:"Rakhigarhi", option4:"Ropar", answer:"Dholavira", display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     { _id:2, sub_id:1, sub: 'History', questions: 'With reference to the history of ancient India, Bhavabhuti, Hastimalla and Kshemeshvara were famous', option1:"Jain monks", option2:"playrights", option3:"temple architects", option4:"philosophers", answer:"playrights", display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     { _id:3, sub_id:1, sub: 'History', questions: 'With reference to Indian history, who among the following is a future Buddha, yet to come to save the world?', option1: "Avalokiteshvara", option2:"Lokesvara", option3:"Maitreya", option4:"Padmapani", answer:"Maitreya", display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     { _id:4, sub_id:1, sub: 'History', questions: 'Which one of the following is not a Harappan site?', option1:"Chanhudaro", option2:"Kot Diji", option3:"Sohgaura", option4:"Desalpur", answer:"Sohgaura", display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     { _id:5, sub_id:1, sub: 'History', questions: 'Which of the following phrases defines the nature of the ‘Hundi’  generally referred to in the sources of the post-Harsha period?', option1:"An advisory issued by the king to his subordinates", option2:"A diary to be maintained for daily accounts", option3:"A bill of exchange", option4:"An order from the feudal lord to his subordinates", answer:"A bill of exchange", display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},    
//     { _id:6, sub_id:1, sub: 'History', questions: 'Which one of the following books of Ancient India has the love story of the son of the founder of the Sunga Dynasty?', option1:'Swapnavasavadatta', option2:'Malavikagnimitra', option3:'Meghadoota', option4:'Ratnavali', answer:'Malavikagnimitra', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     { _id:7, sub_id:1, sub: 'History', questions: 'With reference to the period of the Gupta dynasty in ancient India, the towns Ghantasala, Kadura and Chaul were well known as', option1:'ports handling foreign trade', option2:'capitals of powerful kingdoms', option3:'places of exquisite stone art and architecture', option4:'important Buddhist pilgrimage centres', answer:'ports handling foreign trade', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     { _id:8, sub_id:1, sub: 'History', questions: 'Who among the following rulers advised his subjects through this inscription?“Whosoever praises his religious sect or blames other sects out of excessive devotion to his own sect, with the view of glorifying his own sect, he rather injures his own sect very severely.”', option1:'Ashoka', option2:'Samudragupta', option3:'Harshavardhana', option4:'Krishnadeva Raya', answer:'Ashoka', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     { _id:9, sub_id:1, sub: 'History', questions: 'The beneficiaries of Asoka’s donations in the region of Barabar Hill were__?', option1:'Buddhists', option2:'Ajivikas', option3:'Svetambar Jains', option4:'Digambar Jains', answer:'Ajivikas', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     { _id:10, sub_id:1, sub: 'History', questions: 'Which one of the following places was a mint centre of the Yaudheyas ?', option1:'Bayana', option2:'Rohtak', option3:'Bareilly', option4:'Mathura', answer:'Rohtak', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
   
//     {_id:101, sub_id:2, sub:'Geography', questions:'Which one of the lakes of West Africa has become dry and turned into a desert?', option1:'Lake Victoria', option2:'Lake Faguibine', option3:'Lake Oguta', option4:'Lake Volta', answer:'Lake Faguibine', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:102, sub_id:2, sub:'Geography',questions:'Gandikota canyon of South India was created by which one of the following rivers ?', option1:'Cauvery', option2:'Manjira', option3:'Pennar', option4:'Tungabhadra', answer:'Pennar', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:103, sub_id:2, sub:'Geography',questions:'The term “Levant” often heard in the news roughly corresponds to which of the following regions?', option1:'Region along the eastern Mediterranean shores', option2:'Region along North African shores stretching from Egypt to Morocco', option3:'Region along Persian Gulf and Horn of Africa', option4:'The entire coastal Mediterranean Sea of areas', answer:'Region along the eastern Mediterranean shores', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:104, sub_id:2, sub:'Geography',questions:'In the northern hemisphere, the longest day of the year normally occurs in the:', option1:'First half of the month of June', option2:'Second half of the month of June', option3:'First half of the month of July', option4:'Second half of the month of July', answer:'Second half of the month of June', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:105, sub_id:2, sub:'Geography',questions:'The black cotton soil of India has been formed due to the weathering of', option1:'Brown forest soil', option2:'Fissure volcanic rock', option3:'Granite and schist', option4:'Shale and limestone', answer:'Fissure volcanic rock', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},

//     {_id:201, sub_id:3, sub:'Sports', questions: 'David Stern who passed away recently was the Commissioner of which famous Sports league?', option1:'Formula 1, F1', option2:'National Basketball Association, NBA', option3:'Major League Baseball, MLB', option4:'National Hockey League, NHL', answer:'National Basketball Association, NBA', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:202, sub_id:3, sub:'Sports', questions: 'What are ‘the camel’, ‘the mongoose’, ‘kaboom’ and ‘aluminum’ that have been in news recently?', option1:'Cricket bats', option2:'Military codes', option3:'Squadrons', option4:'Chess moves', answer:' Cricket bats', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:203, sub_id:3, sub:'Sports', questions: 'Which badminton player recently won the Malaysian Masters 2020 title?', option1:'Viktor Axelsen', option2:'Kento Momota', option3:'Sai Praneeth', option4:'Kidambi Srikanth', answer:'Kento Momota', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:204, sub_id:3, sub:'Sports', questions: 'Which Tennis star recently won the Dubai Tennis Championships, for the first time since 2013?', option1:'Rafael Nadal', option2:'Roger Federer', option3:'Novak Djokovic', option4:'Andy Murray', answer:'Novak Djokovic', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:205, sub_id:3, sub:'Sports', questions: 'The 2021 Commonwealth Youth Games which has been rescheduled to 2023, was previously planned to be held in which country?', option1:'Cambodia', option2:'Trinidad and Tobago', option3:'Guyana', option4:'Jamaica', answer:'Trinidad and Tobago', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},

//     {_id:301, sub_id:4, sub:'Political Science', questions: 'Which of the following is NOT possible by a law of Parliament under Article 3 of the Constitution?', option1:'Admission of new States', option2:'Alternation of boundaries of States', option3:'Alteration of areas of States', option4:'Formation of new States', answer:'Admission of new States', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:302, sub_id:4, sub:'Political Science', questions: 'Which one of the following is NOT correctly matched?', option1:'Article 39 A - Equal Justice and free legal aid', option2:'Article 40 - Organisation of Village Panchayats', option3:'Article 44 - Uniform Civil Code', option4:'Article 48 - Separation of Judiciary from Executive', answer:'Article 48 - Separation of Judiciary from Executive', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:303, sub_id:4, sub:'Political Science', questions: 'Union Budget is always presented first in…', option1:'Lok Sabha', option2:'Rajya Sabha', option3:'Supreme Court', option4:'Vidhan Sabha', answer:'Lok Sabha', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:304, sub_id:4, sub:'Political Science', questions: 'Who became prime minister of India in the year 1966?', option1:'Indira Gandhi', option2:'Lata Devi', option3:'Vijay Lakshmi Pandit', option4:'Sarojini Devi', answer:'Indira Gandhi', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:305, sub_id:4, sub:'Political Science', questions: 'Who was the first Deputy Chairman of Planning Commission?', option1:'Gulzari lal Nanda', option2:'Lata Devi', option3:'Vijay Lakshmi Pandit', option4:'Sarojini Devi', answer:'Gulzari lal Nanda', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},

//     {_id:401, sub_id:5, sub:'Economics', questions: 'What is output per unit of input of labor known as?', option1:'Labor Productivity', option2:'Production ability', option3:'Capacity', option4:'None of the Above', answer:'Labor Productivity', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:402, sub_id:5, sub:'Economics', questions: 'Which one of the following is not the most likely measure the Government/RBI takes to stop the slide of Indian rupee?', option1:'urbing imports of non-essential goods and promoting exports', option2:'Encouraging Indian borrowers to issue rupee-denominated Masala Bonds', option3:'Easing conditions relating to external commercial borrowing', option4:'Following an expansionary monetary policy', answer:'Following an expansionary monetary policy', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:403, sub_id:5, sub:'Economics', questions: 'Which of the following is the most likely consequence of implementing the ‘Unified Payments Interface (UPI)’?', option1:'Mobile wallets will not be necessary for online payments', option2:' Digital currency will totally replace the physical currency in about two decades', option3:'FDI inflows will drastically increase', option4:'Direct transfer of subsidies to poor people will become very effective.', answer:'Mobile wallets will not be necessary for online payments', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:404, sub_id:5, sub:'Economics', questions: 'Recently, India’s first ‘National Investment and Manufacturing Zone’ was proposed to be set up in...', option1:'Andhra Pradesh', option2:'Gujarat', option3:'Maharashtra', option4:'Uttar Pradesh', answer:'Andhra Pradesh', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:405, sub_id:5, sub:'Economics', questions: 'The money multiplier in an economy increases with which one of the following?', option1:' Increase in the Cash Reserve Ratio in the banks.', option2:'Increase in the Statutory Liquidity Ratio in the banks', option3:' Increase in the banking habit of the people', option4:'Increase in the population of the country', answer:' Increase in the banking habit of the people', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},

//     {_id:501, sub_id:6, sub:'Sociology', questions: 'Which one of the following is the distinctive characteristic of human society in comparison to the animal society?', option1:'Interaction', option2:'Culture', option3:'Territory', option4:'Group life', answer:'Culture', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:502, sub_id:6, sub:'Sociology', questions: 'The tendency to see one’s own ideas, beliefs and practices superior to that of others is called:', option1:'Xenophobia', option2:'Self-orientation', option3:'Egocentrism', option4:'Ethnocentrism', answer:'Ethnocentrism', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:503, sub_id:6, sub:'Sociology', questions: 'Which one of the following is important to differentiate between the social group and the social category?', option1:' Size of the groups', option2:'Reciprocal communication', option3:'Geographical location', option4:' Formal rules and regulations', answer:' Formal rules and regulations', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:504, sub_id:6, sub:'Sociology', questions: ' The sociological term used to describe the statuses 0 intern, resident and independent medical practitioner successively occupied by a medical student is:', option1:'Status sequence', option2:' Status group', option3:'Status set', option4:'Achieved status', answer:'Status sequence', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:505, sub_id:6, sub:'Sociology', questions: 'A process whereby the norms and rules in various social settings grow and crystallise is called:', option1:' Socialisation', option2:'Interaction', option3:' Sanskritisation', option4:'Institutionalisation', answer:'Socialisation', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},

//     {_id:601, sub_id:7, sub:'Environmental Science',questions:'Among the following crops, which one is the most important anthropogenic source of both methane and nitrous oxide ?', option1:'Cotton', option2:'Rice', option3:'Sugarcane', option4:'Wheat', answer:'Rice', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:602, sub_id:7, sub:'Environmental Science',questions:'“Climate Action Tracker” which monitors the emission reduction pledges of different countries is a :',option1:'Database created by coalition of research organisations', option2:'Wing of “International Panel of Climate Change”', option3:'Committee under “United Nations Framework Convention on Climate Change”', option4:'Agency promoted and financed by United Nations Environment Programme and World Bank', answer:'Database created by coalition of research organisations', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:603, sub_id:7, sub:'Environmental Science',questions:'“Biorock technology” is talked about in which one of the following situations?', option1:'Restoration of damaged coral reefs', option2:'Development of building materials using plant residues', option3:'Identification of areas for exploration/extraction of shale gas', option4:'Providing salt licks for wild animals in forests/protected areas', answer:'Restoration of damaged coral reefs', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:604, sub_id:7, sub:'Environmental Science',questions:'Which one of the following has been constituted under the Environment (Protection) Act, 1986 ?', option1:'Central Water Commission', option2:'Central Ground Water Board', option3:'Central Ground Water Authority', option4:'National Water Development Agency', answer:'Central Ground Water Authority', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:605, sub_id:7, sub:'Environmental Science',questions:'Which one of the following best describes the term “greenwashing”?', option1:'Conveying a false impression that a company’s products are eco-friendly and environmentally sound', option2:'Non-inclusion of ecological/ environmental costs in the Annual Financial Statements of a country', option3:'Ignoring the consequences disastrous ecological while infrastructure development undertaking', option4:'Making mandatory provisions for environmental costs in a government project/programme', answer:'Conveying a false impression that a company’s products are eco-friendly and environmentally sound', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},

//     {_id:701, sub_id:8, sub:'General Science',questions:'Which one of the following is the context in which the term “qubit” is mentioned?', option1:'Cloud Services', option2:'Quantum Computing', option3:'Visible Light Communication Technologies', option4:'Wireless Communication Technologies', answer:'Quantum Computing', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:702, sub_id:8, sub:'General Science',questions:'Which one of the following statements best describes the role of B cells and T cells in the human body?', option1:'They protect the environmental allergens body', option2:'They alleviate the body’s pain and inflammation.', option3:'They act as immunosuppressants in the body.', option4:'They protect the body from the diseases caused by pathogens.', answer:'They protect the body from the diseases caused by pathogens.', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:703, sub_id:8, sub:'General Science',questions:'Which one of the following is a reason why astronomical distances are measured in light-years?', option1:'Distance among stellar bodies do not change', option2:'Gravity of stellar bodies does not change', option3:'Light always travels in straight line', option4:'Speed of light is always same', answer:'Speed of light is always same', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:704, sub_id:8, sub:'General Science',questions:'“Triclosan” considered harmful when exposed to high levels for a long time, is most likely present in which of the following?',  option1:'Food preservatives', option2:'Fruit ripening substances', option3:' reused plastic containers', option4:'Toiletries', answer:'Toiletries', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//     {_id:705, sub_id:8, sub:'General Science',questions:'The term “ACE2” is talked about in the context of', option1:' genes introduced in the genetically modified plants', option2:'development of India’s own satellite navigation system', option3:' radio collars for wildlife tracking', option4:'spread of viral diseases', answer:'spread of viral diseases', display_status:false, createTime:Date.parse(Date()), updateTime:Date.parse(Date()), status:false},
//  ]
  // var sub = [
  //   {_id:1,sub:"History",create:Date.parse(Date()),update:Date.parse(Date()),status:true,image:"/images/history.jpg"},
  //   {_id:2,sub:"Geography",create:Date.parse(Date()),update:Date.parse(Date()),status:true,image:"/images/geography.jpeg"},
  //   {_id:3,sub:"Sports",create:Date.parse(Date()),update:Date.parse(Date()),status:true,image:"/images/sport.jpg"},
  //   {_id:4,sub:"Political Science",create:Date.parse(Date()),update:Date.parse(Date()),status:true,image:"/images/politicalScience.jpg"},
  //   {_id:5,sub:"Economics",create:Date.parse(Date()),update:Date.parse(Date()),status:true,image:"/images/economics.jpg"},
  //   {_id:6,sub:"Sociology",create:Date.parse(Date()),update:Date.parse(Date()),status:true,image:"/images/sociology.png"},
  //   {_id:7,sub:"Environmental Science",create:Date.parse(Date()),update:Date.parse(Date()),status:true,image:"/images/environmentalScience.png"},
  //   {_id:8,sub:"General Science",create:Date.parse(Date()),update:Date.parse(Date()),status:true,image:"/images/generalScience.jpeg"}
  // ]
    dbo.collection("rules").insertMany(rules, function(err, res) {
      if (err) throw err;
      console.log("Number of documents inserted: " + res.insertedCount);
      db.close();
    });
    // dbo.dropCollection("subject",(err,ok)=>{
    //     console.log('deleted');
    // })
});
