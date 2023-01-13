const apiHub = {
  // 开发环境
  'dev': {
    'API_BASE': 'http://192.168.1.201:8085'
  },
  // 测试环境
  'test': {
    'API_BASE_02': 'https://uat.db0909.com',
    'API_BASE': 'https://godiva.db0909.com',
    // 'API_BASE': 'http://52.130.76.238:8085/scrm',
  },
  // 生产环境
  'prod': {
    'API_BASE': 'https://wechatsys.godiva.cn'
  }
};
const ENV = 'prod';
export default {
  ENV,
  ...apiHub[ENV]
}