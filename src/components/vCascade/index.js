import vCascade from './src/vCascade';

vCascade.install = function (Vue) {
  Vue.component(vCascade.name, vCascade);
};

export default vCascade;
