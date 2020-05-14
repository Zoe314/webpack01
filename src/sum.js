// esModule(浏览器环境)   commonJS(Node环境)
// esModule   引入：import   暴露js：export
// commonJS   引入：require  暴露JS：module.exports
function sum(a, b) {
    return a + b;
}
// export { sum } //引入时只能叫sum
export default sum;  //使用这个方式导出，在引入时可以随便起名