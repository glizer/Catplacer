window.onload = function() {
    var options = {
        minSize: 100,
        delay: 2000,
        words: [{0: ['Новость','Новости','Новостей','Новостью']},
            {1:['Информация', 'Информация', 'Информации', 'Информацией', 'Информацию']},
            {2:['Комментарий', 'Комментарии', 'Комментариев', 'Комментарием']}],
        cat: ['Котик', 'Котики', 'Котиков', 'Котиком', 'Котика'],
        link: 'http://fishki.net/picsw/022011/14/bonus/koshki/'
    };
    var replaceByCat = {
        handleImages: function(timer) {
            for (var images = document.getElementsByTagName('img'), imgCount = images.length, i = 0; imgCount > i; i++) {
                var image = images[i],
                    imageSrc = image.src;

                replaceByCat.replaceImages(image, imageSrc)
            }
            timer > 0 && setTimeout(function() {
                replaceByCat.handleImages(timer)
            }, timer)
        },
        replaceImages: function(image, imageSrc) {
            if (-1 == imageSrc.indexOf(options.link)) {
                var imageHeight = image.clientHeight,
                    imageWidth = image.clientWidth,
                    minsize = imageHeight > options.minSize && imageWidth > options.minSize,
                    minProportions = (Math.max(imageHeight, imageWidth)) / (Math.min(imageHeight, imageWidth)) < 2,
                    hasClass = image.classList.contains('dont-replace');

                if (minProportions && minsize && !hasClass) {
                    replaceByCat.handleImg(image);
                }
            } else image.onload = function() {
                imageSrc.indexOf(options.link) == -1 && replaceByCat.handleImg(image)
            }
        },
        handleImg: function(image) {
            image.onerror = function() {
                replaceByCat.handleBrokenImg(image)
            }; replaceByCat.setNewImg(image)
        },
        setNewImg: function(image) {
            var imageWidth = image.clientWidth,
                imageHeight = image.clientHeight;
            image.setAttribute('data-replace', image.src);
            image.style.width = imageWidth + 'px';
            image.style.height = imageHeight + 'px';
            image.src = options.link + randomNumber(2, 135) + '.jpg';
            function randomNumber(min, max) {
                var rand = min - 0.5 + Math.random() * (max - min + 1);
                rand = Math.round(rand);
                return padding(rand);
            }
            function padding(number) {
                var str = '' + number;
                while (str.length < 3) {
                    str = '0' + str;
                }
                return str;
            }
        },
        handleBrokenImg: function(image) {
            var src = image.src,
                number = src.indexOf(options.link);
            if (number > -1) {
                replaceByCat.setNewImg(image)
            }
        },
        handleText: function () {
            options.words.forEach(function (type, i) {
                type[i].forEach(function (word, i) {
                    var re = new RegExp(word, 'g');
                    document.body.innerHTML=document.body.innerHTML.replace(re, '<span data-replace="'+ word + '">' + options.cat[i] + '</span>');
                });
            });
        }
    };
    contextMenu = {
        elements: '[data-replace]',

        callModal: function(e) {
            e.preventDefault();
            var modal = document.createElement('div'),
                close = document.createElement('span'),
                overlay = document.createElement('div');

            createElement(overlay, 'overlay', '', document.body);
            createElement(modal, false, contextMenu.modalTemplate(), document.body);
            createElement(close, 'close', 'X', modal);

            close.onclick = function() {
                modal.remove();
                overlay.remove();
            };
            
            function createElement(element, className, content, target) {
                element.classList.add('modal' + (className ? '-' + className : ''));
                element.innerHTML = content;
                target.appendChild(element);
            }

        },
        modalTemplate: function() {
            var template = '',
                images = document.querySelectorAll('img[data-replace]'),
                texts = document.querySelectorAll('span[data-replace]');

            template += '<div class="modal-image">';
            template += '<h3>Котиками заменены картинки</h3>';
            images.forEach(function(image) {
                template += '<img class="dont-replace" src="' + image.getAttribute('data-replace')+ '"/>';
            });
            template += '</div>';
            template += '<div class="text-modal">Котиками заменено слов: ' + texts.length + '</div>';

            return template;
        }
    };
    document.addEventListener('DOMContentLoaded', replaceByCat.handleImages(options.delay));
    document.addEventListener('DOMContentLoaded', replaceByCat.handleText(options.replaceWords, options.byWord));
    setTimeout(function () {
        document.querySelectorAll(contextMenu.elements).forEach(function (element) {
            element.addEventListener('contextmenu', contextMenu.callModal);
        })
    },1000);
};