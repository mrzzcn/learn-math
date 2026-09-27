// 附录“学习工具”的二维码：每个网站一张 qr-<名字>.svg，改网址只改这里。
import QRCode from 'qrcode';

export const SITES = {
  desmos: 'https://www.desmos.com/calculator',
  'geogebra-calculator': 'https://www.geogebra.org/calculator',
  'geogebra-geometry': 'https://www.geogebra.org/geometry',
  wolframalpha: 'https://www.wolframalpha.com/',
  phet: 'https://phet.colorado.edu/zh_CN/',
  shuxuele: 'https://www.shuxuele.com/',
  khanacademy: 'https://zh.khanacademy.org/',
  '3blue1brown': 'https://space.bilibili.com/88461692',
  nrich: 'https://nrich.maths.org/',
  smartedu: 'https://basic.smartedu.cn/',
  'moe-standard': 'http://www.moe.gov.cn/srcsite/A26/s8001/202204/t20220420_619921.html',
  ztc: 'https://ztc.zzedu.net.cn/',
  zhongkao: 'https://www.zhongkao.com/',
  '51jiaoxi': 'https://www.51jiaoxi.com/',
  kmath: 'https://kmath.cn/',
  zgkao: 'https://www.zgkao.com/',
  sohu: 'https://www.sohu.com/',
  '163': 'https://www.163.com/',
  bendibao: 'https://zz.bendibao.com/',
};

const files = {};
for (const [name, url] of Object.entries(SITES)) {
  files[`qr-${name}.svg`] = await QRCode.toString(url, { type: 'svg', margin: 1, errorCorrectionLevel: 'M' });
}
export default files;
