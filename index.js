function observerComp() {
    const sections = document.querySelectorAll('section')
    const icons = document.querySelectorAll('.dignity__icon')
    const fnPhone = document.querySelector('.fn__phone')
    const phoneLeft = document.querySelector('.phone__left')
    const phoneRight = document.querySelector('.phone__right')
    
    
    function lazyLoad(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList[0] === 'dignity' && icons.forEach((icon) => icon.classList.add('jump'))
                if(entry.target.classList[0] === 'functions') {
                   fnPhone.classList.add('from-left')
                } 
                entry.target.classList[0] === 'sales' && [phoneLeft, phoneRight].forEach((phone) => phone.classList.add('from-right'))
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const observer = new IntersectionObserver(lazyLoad, {
        root: null, 
        rootMargin: '0px',
        threshold: 0.2 
    });
    
    
    sections.forEach(element => {
        observer.observe(element);
    });
}

function phoneSlider() {
    const titles = document.querySelectorAll('.fn__title')
    const arrayTitles = Array.from(titles)
    const phoneDisplay = document.querySelector('.phone__display')
    const description = document.querySelector('.fn__description')
    const displays = new Map([
        ['title__favorites', './static/images/phone2_favorites.jpg'], 
        ['title__profile', './static/images/phone2_actions.jpg'],
        ['title__subscribtion', './static/images/phone2_subsribtions.jpg'],
        ['title__map', './static/images/phone2_map.jpg'],
        ['title__feed', './static/images/phone2_list.jpg']]
    )
    const texts = new Map([
        ['title__favorites', ["Когда-то избранными были те, кто под звёздно-полосатым флагом шёл отдавать свою юность в джунглях", "Теперь избранное — это то, что ты сам выбираешь в своём телефоне, без лишних жертв."]], 
        ['title__profile', ["Вы всегда получите полную информацию об акции: подробное описание, бренд, магазины и торговые центры где походит акция.", "Также доступна возможность сразу перейти на сайт товара и купить в рамках действующей акции."]],
        ['title__subscribtion', ["Хотите знать, когда будут акции на купальники или бронежилеты?", "Подпишитесь, и не пропустите шанс подготовиться к отпуску или к чему-то посерьёзнее!"]],
        ['title__map', ["На нашей карте указаны не только магазины с актуальными скидками, но и горячие точки для заработка боевых жетонов.", "Присоединяйся к команде в своем новом, идеально сидящем на бёдрах, бикини и не упусти возможность разблокировать легендарный арбалет за заслуги на полях брани!"]],
        ['title__feed', ["Вьетнам, 1967-й: любой мог получить к пулемету ленту патронов 7.62 калибра, только руку протяни.", "Сегодня всё почти так же, только лента не с патронами, а с акциями, и находится она не в ящике с боеприпасами, а у тебя в телефоне."]]]
    )

    arrayTitles[1].classList.add('title__active')

    animationTitles(arrayTitles)
    swipePhone()

    titles.forEach((title) => title.addEventListener('click', (event) => {
            event.preventDefault()
            if (title.classList.contains('title__active')) return;
            shiftTitle(arrayTitles, arrayTitles.indexOf(event.target))
    }))
    
    function animationTitles(arr) {                                                          
        let rightEdge = 0
        arr.forEach((el, i) => {
            const index = arrayTitles.indexOf(el)
            if(!i) {
                arrayTitles[index].style.setProperty('left', `10px`)
                arrayTitles[index].classList.remove('title__active')
            } else if(i === 1) {
                arrayTitles[index].style.setProperty('left', `585px`)
                arrayTitles[index].classList.add('title__active')
                rightEdge += 585 + arrayTitles[index].clientWidth + 50
            } else {
                arrayTitles[index].style.setProperty('left', `${rightEdge}px`)
                rightEdge += 50 + arrayTitles[index].clientWidth    
                arrayTitles[index].classList.remove('title__active')            
            }
        })
    }

    function shiftTitle(arr, index) {
        const shiftedTitles = shiftToSecondPosition(arr, index)

        phoneDisplay.addEventListener('transitionend', () => {
            phoneDisplay.style.backgroundImage =  `url(${displays.get(arr[index].classList[0])})`
            phoneDisplay.style.opacity = 1
        }, {once: true})
        phoneDisplay.style.opacity = 0;
        description.style.opacity = 0;
        
        description.addEventListener('transitionend', () => {
            description.innerHTML = `
            <p>${texts.get(arr[index].classList[0])[0]}</p>
            <p>${texts.get(arr[index].classList[0])[1]}</p>
            `
            description.style.opacity = 1
        }, {once: true})

        animationTitles(shiftedTitles)
    }

    function swipePhone() {
        let startX, endX;

        phoneDisplay.addEventListener('mousedown', e => {
            startX = e.clientX
        })
        phoneDisplay.addEventListener('mouseup', e => {
            endX = e.clientX
            let activeIndex
            arrayTitles.forEach((title, index) => {
                title.classList.contains('title__active') && (activeIndex = index)
            })

            if((startX - endX) > 0) {
                shiftTitle(arrayTitles, activeIndex === 4 ? 0 : activeIndex + 1)
            } else if(endX - startX > 0) {
                shiftTitle(arrayTitles, activeIndex === 0 ? 4 : activeIndex - 1)
            }
        })
        
        

        
    }

    function shiftToSecondPosition(arr, index) {
        const len = arr.length;
        let newArr;
        if (index === 1) {
            return arr;
        } else if (index < 1) {
            const shiftAmount = (1 - index + len) % len;
            newArr = [...arr.slice(-shiftAmount), ...arr.slice(0, -shiftAmount)];
        } else {
            const shiftAmount = index - 1;
            newArr = [...arr.slice(shiftAmount), ...arr.slice(0, shiftAmount)];
        }
        return newArr;
    }
}

function partnersScroll() {
    const track = document.querySelector('.partners__logos')
    const overflow = document.querySelector('.logos__overflow')
    let currentPosition = 0;
    let speed = 1;
    let removeReady = false;
    let hover = false;

    function startCarousel() {
        if(hover) return;
        currentPosition += speed;
        track.style.transform = `translateX(${currentPosition}px)`;

        if (track.lastElementChild.getBoundingClientRect().left >= overflow.getBoundingClientRect().right && removeReady) {
            currentPosition -= (track.lastElementChild.offsetWidth + 44) / 2;
            track.style.transform = `translateX(${currentPosition}px)`;
            track.removeChild(track.lastElementChild)
            removeReady = false
        }
        if (overflow.getBoundingClientRect().right <= track.lastElementChild.getBoundingClientRect().right && !removeReady) {
            removeReady = true
            currentPosition -= (track.lastElementChild.offsetWidth + 44) / 2;
            track.insertBefore(track.lastElementChild.cloneNode(), track.firstElementChild)
            track.style.transform = `translateX(${currentPosition}px)`;
        }

        requestAnimationFrame(startCarousel);
    }

startCarousel();
    
}


function App() {
    observerComp()
    phoneSlider()
    partnersScroll()
}

App()

