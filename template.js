module.exports = (code, challenge) => ```
require = null;
process = null;

for(let i=0;i<${challenge.runs};i++) {
    for(let j=0;j<${challenge.inputs.length};j++){
        (${code})();
    }
}
```