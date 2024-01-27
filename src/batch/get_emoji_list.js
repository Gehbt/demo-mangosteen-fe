// !  achieve
const trList =  document.querySelector('tbody').querySelectorAll('tr')
const trArr = Array.from(trList)
const res = []
trArr.map(tr => {
  const tg = tr.children[0]
  const tg2 = tr.children[1]
  console.log(tg);
  if(tg.classList.contains("mediumhead")){
    // console.log(tg,"分类" );
    res.push([tg.textContent])
  }else if(tg.classList.contains("rchars")){
    if(tg.tagName.toLocaleLowerCase() === "th"){
      // console.log(tg,"表头");
    }else{
      const last = res[res.length-1]
      last[1] = last[1] || []
      last[1].push(tg2.textContent)
      // console.log(tg2,"数据");
    }
  }
})
