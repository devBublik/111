var banners = [
    '', '', ''
]

var item = 1;
function getItemElement(){
    return document.getElementById("banner");
}
function getIndicatorElement(number){
    return document.getElementById(`indicator${number}`)
}
function getIndicatorList(){
    return [
        getIndicatorElement(1),
        getIndicatorElement(2),
        getIndicatorElement(3)
    ];
}

function setBanner(number){
    const bannerContainer = document.querySelector('#banner-blocks')
    bannerContainer.style.opacity = '0';
    const set = () => {
        bannerContainer.innerHTML = banners[number - 1];
        bannerContainer.style.opacity = '1';
    }
    setTimeout(set, 750)
}

var prevClick = new Date();
function next(){
    if (new Date().getTime() - prevClick.getTime() <= 2*1000) return;
    resetInterval()
    var el = getItemElement();
    var indicatorList = getIndicatorList();
    switch (item){
        case 1:
            el.classList.remove("item1");
            el.classList.add("item2");
            indicatorList[0].classList.remove("active");
            indicatorList[1].classList.add("active");
            setBanner(2);
            item = 2;
            break;
        case 2:
            el.classList.remove("item2");
            el.classList.add("item3");
            indicatorList[1].classList.remove("active");
            indicatorList[2].classList.add("active");
            setBanner(3);
            item = 3;
            break;
        case 3:
            el.classList.remove("item3");
            el.classList.add("item1");
            indicatorList[2].classList.remove("active");
            indicatorList[0].classList.add("active");
            setBanner(1);
            item = 1;
            break;
    }
    prevClick = new Date();
}
function prev(){
    if (new Date().getTime() - prevClick.getTime() <= 2*1000) return;
    resetInterval()
    var el = getItemElement();
    var indicatorList = getIndicatorList();
    switch (item){
        case 1:
            el.classList.remove("item1");
            el.classList.add("item3");
            indicatorList[0].classList.remove("active");
            indicatorList[2].classList.add("active");
            setBanner(3);
            item = 3;
            break;
        case 2:
            el.classList.remove("item2");
            el.classList.add("item1");
            indicatorList[1].classList.remove("active");
            indicatorList[0].classList.add("active");
            setBanner(1);
            item = 1;
            break;
        case 3:
            el.classList.remove("item3");
            el.classList.add("item2");
            indicatorList[2].classList.remove("active");
            indicatorList[1].classList.add("active");
            setBanner(2);
            item = 2;
            break;
    }
    prevClick = new Date();
}
var interval;
function resetInterval(){
    clearInterval(interval)
    startInterval();
}
function startInterval(){
    interval = setInterval(next, 18*1000)
}
