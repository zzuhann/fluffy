export const navbars = [
  {
    name: "配對專區",
    targetLink: "/dating",
    needToLogin: true,
  },
  {
    name: "寵物日記",
    targetLink: "/petdiary",
    needToLogin: false,
  },
  {
    name: "寵物文章補給",
    targetLink: "/articles",
    needToLogin: false,
  },
  {
    name: "24 小時動物醫院",
    targetLink: "/clinic",
    needToLogin: false,
  },
];

export const areaList = ["全台診所", "北部地區", "中部地區", "南部地區"];

export const area = [
  "臺北市",
  "新北市",
  "基隆市",
  "宜蘭縣",
  "桃園市",
  "新竹縣",
  "新竹市",
  "苗栗縣",
  "臺中市",
  "彰化縣",
  "南投縣",
  "雲林縣",
  "嘉義縣",
  "嘉義市",
  "臺南市",
  "高雄市",
  "屏東縣",
  "花蓮縣",
  "臺東縣",
  "澎湖縣",
  "金門縣",
  "連江縣",
];

type shelterInfoType = {
  pkid: number;
  name: string;
  placeid: string;
  latAndLng: string;
};

export const shelterInfo: shelterInfoType[] = [
  {
    pkid: 48,
    name: "基隆市寵物銀行",
    placeid: "ChIJGVlW839SXTQRL_O9Qq9Vf_4",
    latAndLng: "25.127544440764627,121.67530313878574",
  },
  {
    pkid: 49,
    name: "臺北市動物之家",
    placeid: "ChIJl7Ebe6GsQjQRL8NduPAus1s",
    latAndLng: "25.06073546762179,121.60335872529052",
  },
  {
    pkid: 50,
    name: "新北市板橋區公立動物之家",
    placeid: "ChIJQWFqi7QCaDQRVnWxLnqSS20",
    latAndLng: "24.995254900055944,121.44813259460521",
  },
  {
    pkid: 51,
    name: "新北市新店區公立動物之家",
    placeid: "ChIJFbsM-XcDaDQRXiXkHycCoDA",
    latAndLng: "24.934908794357444,121.49258213523979",
  },
  {
    pkid: 53,
    name: "新北市中和區公立動物之家",
    placeid: "ChIJt4Hi0vUCaDQRVK-MBUIAyj4",
    latAndLng: "24.975853297128957,121.48868102344012",
  },
  {
    pkid: 55,
    name: "新北市淡水區公立動物之家",
    placeid: "ChIJ2VX4-pa6QjQR1JMGOStUp8U",
    latAndLng: "25.21020275732261,121.43040255412967",
  },
  {
    pkid: 56,
    name: "新北市瑞芳區公立動物之家",
    placeid: "ChIJ8_9rgrLaDRQRN9T2vGobQ0c",
    latAndLng: "25.076186180152625,121.79978690437387",
  },
  {
    pkid: 58,
    name: "新北市五股區公立動物之家",
    placeid: "ChIJ8xocoT-mQjQRH5Ndj2dmsUk",
    latAndLng: "25.07782766825477,121.41579929645545",
  },
  {
    pkid: 59,
    name: "新北市八里區公立動物之家",
    placeid: "ChIJ2y68Iy-kQjQR49A0wX0bo7w",
    latAndLng: "25.087807267341546,121.39824669830413",
  },
  {
    pkid: 60,
    name: "新北市三芝區公立動物之家",
    placeid: "ChIJ9c7A2FGzQjQROjnS8NXUY0U",
    latAndLng: "25.226990884597583,121.53832088296558",
  },
  {
    pkid: 61,
    name: "桃園市動物保護教育園區",
    placeid: "ChIJO1r8MdwuaDQRbx7eQWOaj8I",
    latAndLng: "25.008699465878916,121.0277838252893",
  },
  {
    pkid: 62,
    name: "新竹市動物保護教育園區",
    placeid: "ChIJxQSvdh81aDQR9UZaidll6IQ",
    latAndLng: "24.832928530852318,120.91954546576576",
  },
  {
    pkid: 63,
    name: "新竹縣公立動物收容所",
    placeid: "ChIJ7_-eFew2aDQRRCUmn7T9m3c",
    latAndLng: "24.82868223853418,121.01511854062697",
  },
  {
    pkid: 67,
    name: "臺中市動物之家南屯園區",
    placeid: "ChIJvZdowFQ-aTQR31UQ6RszElo",
    latAndLng: "24.148002293972585,120.57529305410456",
  },
  {
    pkid: 68,
    name: "臺中市動物之家后里園區",
    placeid: "ChIJyeW5aY4RaTQR57X1sel_KiE",
    latAndLng: "24.286553533088913,120.70956589643691",
  },
  {
    pkid: 69,
    name: "彰化縣流浪狗中途之家",
    placeid: "ChIJ1fBoINcwaTQRmnaYhLq1JmQ",
    latAndLng: "23.96943941440045,120.61980617718065",
  },
  {
    pkid: 69,
    name: "彰化縣流浪狗中途之家",
    placeid: "ChIJ1fBoINcwaTQRmnaYhLq1JmQ",
    latAndLng: "23.96943941440045,120.61980617718065",
  },
  {
    pkid: 70,
    name: "南投縣公立動物收容所",
    placeid: "ChIJpRVBSioyaTQRe2XJtQ5IBxI",
    latAndLng: "23.906053236225183,120.66986591176989",
  },
  {
    pkid: 71,
    name: "嘉義市動物保護教育園區",
    placeid: "ChIJlegFfESUbjQRp8PA8fgh0kU",
    latAndLng: "23.464516759226314,120.46879732525346",
  },
  {
    pkid: 72,
    name: "嘉義縣流浪犬中途之家",
    placeid: "ChIJWb2C6Je_bjQRDd7h62g7EOc",
    latAndLng: "23.573345988397737,120.50050122525593",
  },
  {
    pkid: 73,
    name: "臺南市動物之家灣裡站",
    placeid: "ChIJfTmyzwd1bjQR9fVp0TQoEfo",
    latAndLng: "22.936929515662282,120.1943806098999",
  },
  {
    pkid: 74,
    name: "臺南市動物之家善化站",
    placeid: "ChIJAYGv1Md8bjQRbmntaFzTZWo",
    latAndLng: "23.149017399172926,120.33161098867875",
  },
  {
    pkid: 75,
    name: "高雄市壽山動物保護教育園區",
    placeid: "ChIJe6qQiGsEbjQR8ptlT6ID2pw",
    latAndLng: "22.637165628878652,120.27792119455152",
  },
  {
    pkid: 76,
    name: "高雄市燕巢動物保護關愛園區",
    placeid: "ChIJRyTpfLkTbjQRIyrn2R3-a-M",
    latAndLng: "22.792888496958263,120.40467382523877",
  },
  {
    pkid: 77,
    name: "屏東縣公立犬貓中途之家",
    placeid: "ChIJzyNT_a08bjQRGL1acG2Lo2c",
    latAndLng: "22.653291983421592,120.60454953576077",
  },
  {
    pkid: 78,
    name: "宜蘭縣流浪動物中途之家",
    placeid: "ChIJL2Si0UrvZzQRIads5hL7Hpc",
    latAndLng: "24.66732768664571,121.83121570429664",
  },
  {
    pkid: 79,
    name: "花蓮縣狗貓躍動園區",
    placeid: "ChIJ7_ci9kWgaDQRhavzIWEtCPQ",
    latAndLng: "23.805926900929023,121.49814378293219",
  },
  {
    pkid: 80,
    name: "臺東縣動物收容中心",
    placeid: "ChIJWaBxyBS4bzQRrHqjg5jni0c",
    latAndLng: "22.719755922854652,121.10088619455327",
  },
  {
    pkid: 81,
    name: "連江縣流浪犬收容中心",
    placeid: "ChIJd9RprY9wQTQRmQRbP2KW3fo",
    latAndLng: "26.1667437333993,119.959645604307",
  },
  {
    pkid: 82,
    name: "金門縣動物收容中心",
    placeid: "ChIJxW8URh-lFDQRtW58GqQu2bE",
    latAndLng: "24.44432032877591, 118.44475015226298",
  },
  {
    pkid: 83,
    name: "澎湖縣流浪動物收容中心",
    placeid: "ChIJAQAAAEFFbDQRSNNQ-Xkd7sk",
    latAndLng: "23.5525258965275,119.62718459641995",
  },
  {
    pkid: 89,
    name: "雲林縣流浪動物收容所",
    placeid: "ChIJvwn1OOK3bjQRodUny3QIG3c",
    latAndLng: "23.715400605306403,120.52572125884902",
  },
  {
    pkid: 92,
    name: "新北市政府動物保護防疫處",
    placeid: "ChIJ3zYgjKYCaDQRc-rZmvISMgo",
    latAndLng: "25.004283929520067,121.46035544668929",
  },
  {
    pkid: 96,
    name: "苗栗縣生態保育教育中心(動物收容所)",
    placeid: "ChIJ3-iZm_KpaTQR-9kOQE1R8tE",
    latAndLng: "24.49976082697349,120.7940658406192",
  },
];
