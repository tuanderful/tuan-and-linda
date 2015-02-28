/* Fix for older browsers */
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
        for (var i = (start || 0), j = this.length; i < j; i++) {
            if (this[i] === obj) {
                return i;
            }
        }
        return -1;
    }
}

(function($) {

    "use strict";

    $(document).ready(function() {

        /* Preloader - remove this and loaderOverlay div in html file, to disable loader.
        ==================================================================================== */
        if (typeof imagesLoaded != 'undefined') {
            imagesLoaded($('body'), function() {
            	wow.init();
                $('.loaderOverlay').fadeOut('slow');
                $('#gallery-wrapper').isotope('reLayout');
            });
        }

        /* Hero height for full and half screen
        ==================================================================================== */
        var windowHeight = $(window).height();
        $('.hero').height(windowHeight - 80);
        $('.hero.mvisible').height(windowHeight - 136);

        $(window).resize(function() {
            var windowHeight = $(window).height();
            $('.hero').height(windowHeight - 80);
            $('.hero.mvisible').height(windowHeight - 136);
        });

        /* Responsive Menu - Expand / Collapse on Mobile
        ==================================================================================== */
        function recalculate_height() {
            var nav_height = $(window).outerHeight();
            $("#navigation").height(nav_height - 56);
        }

        $('#menu-toggle-wrapper').on('click', function(event) {
            recalculate_height();
            $(this).toggleClass('open');
            $("body").toggleClass('open');
            $('#navigation').slideToggle(200);
            event.preventDefault();
        });

        $(window).resize(function() {
            recalculate_height();
        });

        /* Main Menu - Add active class for each nav depending on scroll
        ==================================================================================== */
        $('section').each(function() {
            $(this).waypoint(function(direction) {
                if (direction === 'down') {
                    var containerID = $(this).attr('id');
                    /* update navigation */
                    $('#navigation ul li a,#navigation-dotted ul li a').removeClass('active');
                    $('#navigation ul li a[href*=#' + containerID + '],#navigation-dotted ul li a[href*=#' + containerID + ']').addClass('active');
                }
            }, {
                offset: '80px'
            });

            $(this).waypoint(function(direction) {
                if (direction === 'up') {
                    var containerID = $(this).attr('id');
                    /* update navigation */
                    $('#navigation ul li a,#navigation-dotted ul li a').removeClass('active');
                    $('#navigation ul li a[href*=#' + containerID + '],#navigation-dotted ul li a[href*=#' + containerID + ']').addClass('active');
                }
            }, {
                offset: function() {
                    return -$(this).height() - 80;
                }
            });
        });

        /* Scroll to Main Menu
        ==================================================================================== */
        $('#navigation a[href*=#],#navigation-dotted a[href*=#]').click(function(event) {
            var $this = $(this);
            if ($this.parents("#navigation-dotted").length) { // check to see if navigation is dotted,if yes no offset
                var offset = 0;
            } else {
                var offset = -56;
            }

            $.scrollTo($this.attr('href'), 650, {
                easing: 'swing',
                offset: offset,
                'axis': 'y'
            });
            event.preventDefault();

            // For mobiles and tablets, do the thing!
            if ($(window).width() < 1025) {
                $('#menu-toggle-wrapper').toggleClass('open');
                $('#navigation').slideToggle(200);
            }
        });

        /* Scroll to Element on Page - 
        /* USAGE: Add class "scrollTo" and in href add element where you want to scroll page to.
        ==================================================================================== */
        $('a.scrollTo').click(function(event) {
            var $target = $(this).attr("href");
            event.preventDefault();
            $.scrollTo($($target), 1250, {
                offset: -56,
                'axis': 'y'
            });
        });

        /* Main Menu - Fixed on Scroll
        ==================================================================================== */
        $("#home-content").waypoint(function(direction) {
            if (direction === 'down') {
                $("#main-menu").removeClass("gore");
                $("#main-menu").addClass("dole");
            } else if (direction === 'up') {
                $("#main-menu").removeClass("dole");
                $("#main-menu").addClass("gore");
            }
        }, {
            offset: '1px'
        });

        /* PARALAX and BG Video - disabled on smaller devices
        ==================================================================================== */
        if (!device.tablet() && !device.mobile()) {

            if ($(".player").length) {
                $(".player").mb_YTPlayer();
            }

            /* SubMenu */
            $('#main-menu ul > li').hover(function () {
                $(this).children('ul').fadeIn(300);
            },
            function(){
                $(this).children('ul').fadeOut(300);
            });

            $('.hero,#background-image,.parallax').addClass('not-mobile');

            $('section[data-type="parallax"]').each(function() {
                $(this).parallax("50%", 0.5);
            });

            /* fixed background on mobile devices */
            $('section[data-type="parallax"]').each(function(index, element) {
                $(this).addClass('fixed');
            });
        }

        /* SlideShow
        ==================================================================================== */
        $('.hero-slideshow').each(function() {
            var $slide = $(this);
            var $img = $slide.find('img');

            $img.each(function(i) {
                var cssObj = {
                    'background-image': 'url("' + $(this).attr('src') + '")'
                };

                if (i > 0) {
                    cssObj['display'] = 'none';
                }

                $slide.append($("<div />", {
                    'class': 'slide'
                }).css(cssObj));
            });

            if ($img.length <= 1) {
                return;
            }

            setInterval(function() {
                $slide.find('.slide:first').fadeOut('slow')
                    .next('.slide').fadeIn('slow')
                    .end().appendTo($slide);
            }, 5000);
        });

        /* Notification Messages
        ==================================================================================== */
        $(document).on('click', '.successmsg,.errormsg,.notice,.general', function() {
            var $this = $(this);
            $this.fadeOut();
        });

        /* Portfolio Images
        ==================================================================================== */
        $('#gallery-wrapper').magnificPopup({
            delegate: '.block:not(.isotope-hidden) a',
            type: 'image',
            tLoading: 'Loading image #%curr%...',
            mainClass: 'mfp-img-mobile',
            closeOnBgClick: false,
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
            },
            zoom: {
                enabled: true,
                duration: 300, // don't foget to change the duration also in CSS
                opener: function(element) {
                    return element.parent().find('img');
                }
            },
            image: {
                cursor: null,
                markup: '<div class="mfp-figure">' +
                    '<div class="mfp-close"></div>' +
                    '<div class="mfp-img"></div>' +
                    '<div class="mfp-bottom-bar">' +
                    '<div class="mfp-title"></div>' +
                    '<div class="mfp-counter"></div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="small-gallery-wrapper"><div class="small-gallery"></div></div>',
                tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
                titleSrc: function(item) {
                    return item.el.find('.portfolio-title').text(); // place .html() if you need to show categories too.
                }
            },
            setActive: function($gallery, ind) {

                if (ind !== false) {
                    $gallery.find('img').removeClass('active');
                    $gallery.find('img:eq(' + ind + ')').addClass('active');
                }

                var active_left = $gallery.find('img.active').position().left;
                var gall_width = $gallery.parent().width() / 2;
                var active_width = $gallery.find('img.active').width() / 2;

                $gallery.css('left', -((active_left - gall_width) + active_width));

            },
            callbacks: {
                open: function() {
                    var $gallery = this.contentContainer.find('.small-gallery');
                    var magnificPopup = this;
                    $.each(this.st.items, function(i) {
                        var $img = $(this).parent().find('img');
                        $gallery.append($("<img />", {
                            src: $img.attr('src')
                        }).on('click', function() {
                            magnificPopup.goTo(i);
                        }));
                    });

                    this.content.find('img.mfp-img').load(function() {
                        magnificPopup.st.setActive($gallery, magnificPopup.currItem.index);
                    });

                },
                change: function() {
                    var img = this.content.find('img.mfp-img');
                    var magnificPopup = this;
                    var $gallery = this.contentContainer.find('.small-gallery');

                    // Smanjujemo velicinu slika
                    img.css('max-height', parseFloat(img.css('max-height')) * 0.7);

                    if ($gallery.find('img').length) {
                        img.load(function() {
                            magnificPopup.st.setActive($gallery, magnificPopup.currItem.index);
                        });
                    }

                },
                resize: function() {

                    var img = this.content.parent().find('img.mfp-img');
                    var $gallery = this.contentContainer.find('.small-gallery');

                    img.css('max-height', parseFloat(img.css('max-height')) * 0.7);

                    if ($gallery.find('img').length) {
                        this.st.setActive(this.contentContainer.find('.small-gallery'), false);
                    }
                }
            }
        });

        /* Isotope Portfolio
        ==================================================================================== */
        var $container = $('#gallery-wrapper');
        $container.isotope({
            itemSelector: '.block',
            layoutMode: 'sloppyMasonry',
            filter: '*',
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
        });

        $('#gallery-filter a').click(function() {
            $('#gallery-filter li.active').removeClass('active');
            $(this).parent().addClass('active');

            var selector = $(this).attr('data-filter');
            $container.isotope({
                filter: selector,
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false
                }
            });
            return false;
        });

        /* Google Map 
        ==================================================================================== */
        google.maps.event.addDomListener(window, 'load', init);

        function init() {
            if (typeof markers == 'undefined' || $.type(markers) != 'array') {
                return;
            }

            var markerImages = {
                airport: { url:'images/map/MapPins-small-red1.png',size: new google.maps.Size(35, 58),origin: new google.maps.Point(0, 0),anchor: new google.maps.Point(17.5, 40),scaledSize: new google.maps.Size(35, 344)},
                hotel: { url:'images/map/MapPins-small-red1.png',size: new google.maps.Size(35, 58),origin: new google.maps.Point(0, 58),anchor: new google.maps.Point(17.5, 40),scaledSize: new google.maps.Size(35, 344)},
                restaurant: { url:'images/map/MapPins-small-red1.png',size: new google.maps.Size(35, 58),origin: new google.maps.Point(0, 116),anchor: new google.maps.Point(17.5, 40),scaledSize: new google.maps.Size(35, 344) },
                shopping: { url:'images/map/MapPins-small-red1.png',size: new google.maps.Size(35, 58),origin: new google.maps.Point(0, 174),anchor: new google.maps.Point(17.5, 40),scaledSize: new google.maps.Size(35, 344) },    
                attraction: { url:'images/map/MapPins-small-red1.png',size: new google.maps.Size(35, 58),origin: new google.maps.Point(0, 232),anchor: new google.maps.Point(17.5, 40),scaledSize: new google.maps.Size(35, 344) },
                special: { url:'images/map/MapPins-small-red1.png',size: new google.maps.Size(35, 54),origin: new google.maps.Point(0, 290),anchor: new google.maps.Point(17.5, 40),scaledSize: new google.maps.Size(35, 344) },
        
                bachelor: { url:'images/map/MapPins-big-red1.png',size: new google.maps.Size(53, 93),origin: new google.maps.Point(0, 0),anchor: new google.maps.Point(26.5, 68),scaledSize: new google.maps.Size(53, 372) },
                bachelorette: { url:'images/map/MapPins-big-red1.png',size: new google.maps.Size(53, 93),origin: new google.maps.Point(0, 93),anchor: new google.maps.Point(26.5, 68),scaledSize: new google.maps.Size(53, 372) },
                wedding: { url:'images/map/MapPins-big-red1.png',size: new google.maps.Size(53, 93),origin: new google.maps.Point(0, 186),anchor: new google.maps.Point(26.5, 68),scaledSize: new google.maps.Size(53, 372) },
                weddingParty: { url:'images/map/MapPins-big-red1.png',size: new google.maps.Size(53, 93),origin: new google.maps.Point(0, 279),anchor: new google.maps.Point(26.5, 68),scaledSize: new google.maps.Size(53, 372) },
            };

            var mapOptions = {
                scrollwheel: false,
                zoom: 16,
            //    center: new google.maps.LatLng(44.7679455, 17.1909169), // New York
                styles: [{
                    "featureType": "road",
                    "elementType": "labels",
                    "stylers": [{
                        "visibility": "simplified"
                    }, {
                        "lightness": 20
                    }]
                }, {
                    "featureType": "administrative.land_parcel",
                    "elementType": "all",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.man_made",
                    "elementType": "all",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "transit",
                    "elementType": "all",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "road.local",
                    "elementType": "labels",
                    "stylers": [{
                        "visibility": "simplified"
                    }]
                }, {
                    "featureType": "road.local",
                    "elementType": "geometry",
                    "stylers": [{
                        "visibility": "simplified"
                    }]
                }, {
                    "featureType": "road.highway",
                    "elementType": "labels",
                    "stylers": [{
                        "visibility": "simplified"
                    }]
                }, {
                    "featureType": "poi",
                    "elementType": "labels",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "road.arterial",
                    "elementType": "labels",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [{
                        "hue": "#a1cdfc"
                    }, {
                        "saturation": 30
                    }, {
                        "lightness": 49
                    }]
                }, {
                    "featureType": "road.highway",
                    "elementType": "geometry",
                    "stylers": [{
                        "hue": "#f49935"
                    }]
                }, {
                    "featureType": "road.arterial",
                    "elementType": "geometry",
                    "stylers": [{
                        "hue": "#fad959"
                    }]
                }]
            };

            var mapElement = document.getElementById('map');
            var map = new google.maps.Map(mapElement, mapOptions);
            var infoWindow = new google.maps.InfoWindow();
            var bound = new google.maps.LatLngBounds();
            for (var i = 0; i < markers.length; i++) {

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(markers[i][1], markers[i][2]),
                    map: map,
                    icon: markerImages[markers[i][3]],
                    title: markers[i][0],
                    infoContent: markers[i][4]
                });

                bound.extend(marker.position);
                google.maps.event.addListener(marker, 'click', function() {

                    infoWindow.setContent('<div class="info_content"><h3>' + this.title + '</h3><p>' + this.infoContent + '</p></div>');
                    infoWindow.open(map, this);
                });
                
            };
            map.fitBounds(bound);
        }

        /* Theme Tabs
        ==================================================================================== */
        $('.tabs').each(function() {
            var $tabLis = $(this).find('li');
            var $tabContent = $(this).next('.tab-content-wrap').find('.tab-content');
            $tabContent.hide();
            $tabLis.first().addClass('active').show();
            $tabContent.first().show();
        });

        $('.tabs').on('click', 'li', function(e) {
            var $this = $(this);
            var parentUL = $this.parent();
            var scrollparentURL = $this.parent();

            var tabContent = scrollparentURL.next('.tab-content-wrap');
            parentUL.children().removeClass('active');
            $this.addClass('active');

            tabContent.find('.tab-content').hide();
            var showById = $($this.find('a').attr('href'));
            tabContent.find(showById).fadeIn();
            e.preventDefault();
        });

        /* Theme Accordion
        ==================================================================================== */
        $('.accordion').on('click', '.title', function(event) {
            event.preventDefault();
            var $this = $(this);

            if ($this.closest('.accordion').hasClass('toggle')) {
                if ($this.hasClass('active')) {
                    $this.next().slideUp('normal');
                    $this.removeClass("active");
                }
            } else {
                $this.closest('.accordion').find('.active').next().slideUp('normal');
                $this.closest('.accordion').find('.title').removeClass("active");
            }

            if ($this.next().is(':hidden') === true) {
                $this.next().slideDown('normal');
                $this.addClass("active");
            }
        });
        $('.accordion .contents').hide();
        $('.accordion .active').next().slideDown('normal');

        /* Twitter - open get_tweets.php and populate file with your info.
        ==================================================================================== */
        $('.tweets').each(function() {
            var $this = $(this);

            $.getJSON("twitter/get_tweets.php?get=" + $this.attr('id'), function(data) {

                if (data) {
                    var tweets = '';

                    $.each(data, function() {
                        var tweet = '<div class="tweet">';
                        tweet += '<span class="one-tweet">' + this.text + '</span>';
                        tweet += '<span class="time">' + this.time_ago + ' ago</span>';
                        tweet += '</div>';

                        tweets += tweet;
                    });

                    $this.prepend(tweets);
                }

            }).always(function() {
                //twitterCarousel();
            });

        });

        /* Instagram Script - change Tag to yours and update ClientId
        ==================================================================================== */
        var instagramTag = 'wedding'; // Add Instagram Tag here
        var instagramClientId = '630b5c9d2cab44e08fb9d014cf00b2b6'; // Add ClientId here
        var $instagramSection = $('#instagram-section');
        var max_tag_id = false;

        var getInstagramByTag = function() {

            $.ajax({
                url: "https://api.instagram.com/v1/tags/" + instagramTag + "/media/recent",
                data: $.extend({}, {
                    client_id: instagramClientId,
                    count: 10,
                }, (max_tag_id ? {
                    max_tag_id: max_tag_id
                } : {})),
                type: "GET",
                dataType: "jsonp",
            }).done(function(resp) {

                var img = [];

                $.each(resp.data, function() {
                    if (this.type != 'image') {
                        return;
                    }

                    img.push(
                        $("<a href='" + this.link + "' target='_blank'></a>").append(
                            $("<img>", {
                                src: this.images.thumbnail.url,
                                title: this.caption.text
                            })
                        )
                    );
                });

                if (typeof resp.pagination.next_max_tag_id != 'undefined') {
                    max_tag_id = resp.pagination.next_max_tag_id;
                } else {
                    $instagramSection.find('.load-more').fadeOut();
                }

                $instagramSection.find('.instagram-images').append(img);
            });
        };

        $instagramSection.on('click', '.load-more a', function(e) {
            e.preventDefault();

            getInstagramByTag();
        });

        getInstagramByTag();

        /* WOW plugin triggers animation.css on scroll
        ================================================== */
        var wow = new WOW(
          {
            boxClass:     'wow', // animated element css class (default is wow)
            offset:       250,   // distance to the element when triggering the animation (default is 0)
            mobile:       false  // trigger animations on mobile devices (true is default)
          }
        );

        /* Share Icons
        ==================================================================================== */
        $('.share').socShare({
            facebook: '.soc-fb',
            twitter: '.soc-tw',
            google_plus: '.soc-gplus',
            pinterest: '.soc-pin'
        });

        /* Simple Countdown Timer - change belows date to specific one you want.
        ==================================================================================== */
        if($("#countdown").length) {
            CountDownTimer('12/08/2015 12:00 AM', 'countdown');
        }
        function CountDownTimer(dt, id) {
            var end = new Date(dt);

            var _second = 1000;
            var _minute = _second * 60;
            var _hour = _minute * 60;
            var _day = _hour * 24;
            var timer;

            function showRemaining() {
                var now = new Date();
                var distance = end - now;
                if (distance < 0) {

                    clearInterval(timer);
                    document.getElementById(id).innerHTML = 'EVENT POCEO!';

                    return;
                }
                var days = Math.floor(distance / _day);
                var hours = Math.floor((distance % _day) / _hour);
                var minutes = Math.floor((distance % _hour) / _minute);
                var seconds = Math.floor((distance % _minute) / _second);

                document.getElementById(id).innerHTML = days + '<span>days</span>';
                document.getElementById(id).innerHTML += hours + '<span>hours</span>';
                document.getElementById(id).innerHTML += minutes + '<span>minutes</span>';
                document.getElementById(id).innerHTML += seconds + '<span>seconds</span>';
            }

            timer = setInterval(showRemaining, 1000);
        }

        /* Contact Form
        ==================================================================================== */
        (function(e) {
            function n(e, n) {
                this.$form = e;
                this.indexes = {};
                this.options = t;
                for (var r in n) {
                    if (this.$form.find("#" + r).length && typeof n[r] == "function") {
                        this.indexes[r] = n[r]
                    } else {
                        this.options[r] = n[r]
                    }
                }
                this.init()
            }
            var t = {
                _error_class: "error",
                _onValidateFail: function() {}
            };
            n.prototype = {
                init: function() {
                    var e = this;
                    e.$form.on("submit", function(t) {
                        e.process();
                        if (e.hasErrors()) {
                            e.options._onValidateFail();
                            t.stopImmediatePropagation();
                            return false
                        }
                        return true
                    })
                },
                notEmpty: function(e) {
                    return e != "" ? true : false
                },
                isEmail: function(e) {
                    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e)
                },
                isUrl: function(e) {
                    var t = new RegExp("(^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|(www\\.)?))[\\w-]+(\\.[\\w-]+)+([\\w-.,@?^=%&:/~+#-]*[\\w@?^=%&;/~+#-])?", "gim");
                    return t.test(e)
                },
                elClass: "",
                setClass: function(e) {
                    this.elClass = e
                },
                process: function() {
                    this._errors = {};
                    for (var t in this.indexes) {
                        this.$el = this.$form.find("#" + t);
                        if (this.$el.length) {
                            var n = e.proxy(this.indexes[t], this, e.trim(this.$el.val()))();
                            if (this.elClass) {
                                this.elClass.toggleClass(this.options._error_class, !n);
                                this.elClass = ""
                            } else {
                                this.$el.toggleClass(this.options._error_class, !n)
                            }
                            if (!n) {
                                this._errors[t] = n
                            }
                        }
                        this.$el = null
                    }
                },
                _errors: {},
                hasErrors: function() {
                    return !e.isEmptyObject(this._errors)
                }
            };
            e.fn.isValid = function(t) {
                return this.each(function() {
                    var r = e(this);
                    if (!e.data(r, "is_valid")) {
                        e.data(r, "is_valid", new n(r, t))
                    }
                })
            }
        })(jQuery)

        var $form = $('.actionform');

        //get security question
        function setFormAutoValue(cb) {
            $.ajax({
                'url': 'action.php',
                'data': {
                    get_auto_value: ''
                },
                'type': "POST",
                'dataType': 'json',
            }).done(function(response) {

                if (typeof response.data != 'undefined') {
                    $form.find('.auto-safe label').text(unescape(response.data));
                }

                if (cb) {
                    cb();
                }

            });
        }

        $form.on('click', '.auto-refresh', function(e) {
            e.preventDefault();
            var $this = $(this);
            $this.addClass('fa-spin');

            setFormAutoValue(function() {
                $this.removeClass('fa-spin');
            });
        });

        setFormAutoValue();

        //ajax contact form
        $form.isValid({
            'name': function(data) {
                this.setClass(this.$el.parent());
                return this.notEmpty(data);
            },
            'email': function(data) {
                this.setClass(this.$el.parent());
                return this.isEmail(data);
            },
            'subject': function(data) {
                this.setClass(this.$el.parent());
                return this.notEmpty(data);
            },
            'autovalue': function(data) {
                this.setClass(this.$el.parent());
                return this.notEmpty(data);
            }
        }).submit(function(e) {
            e.preventDefault();
            var $this = $(this);

            $this.find('.notification')
                .attr('class', 'notification');
            $this.find('.notification').text('');

            // $this.find('.loading').show();

            $.ajax({
                'url': $this.attr('action'),
                'type': $this.attr('method'),
                'dataType': 'json',
                'data': $(this).serialize()
            }).done(function(response) {
                $this.find('.loading').hide();
                if (typeof response.type != 'undefined' && typeof response.message != 'undefined') {
                    $this.find('.notification')
                        .addClass(response.type + 'msg')
                        .text(response.message);

                    if (response.type == 'success') {
                        $this.find('input[type="text"], input[type="email"], textarea').val('');
                        setFormAutoValue();
                    }
                }
            });

        });


    });

})(jQuery);
