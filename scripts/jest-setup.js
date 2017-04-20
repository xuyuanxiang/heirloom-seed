// mock global variables
global._vds = []; // eslint-disable-line
global.API_ROOT = 'http://domain.com';
global.bughd = () => {
};
global.px2rem = value => value;
global.px2px = value => value;

jest.mock('../modules/core/debug');
