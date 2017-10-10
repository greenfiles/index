"use strict";
jQuery(function($) {

    /* GLOBAL begin */

    var isOpen = false;
    var isTouch = Modernizr.touch;

    // show loader until page is loaded
    $("body").addClass("unscrollable");

    $(".preloader").show();

    /* Header logo animation begin */
    if (!isTouch) {

        var timeout;

        $('.header').mouseenter(function(event) {

            if (!$(this).hasClass('header-transparent')) {
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    $('.animatedLogo').addClass('play').siblings('img').css('opacity', 0);
                }, 300);
            }
        }).mouseleave(function(event) {
            if (!$(this).hasClass('header-transparent')) {
                clearTimeout(timeout);
                $('.animatedLogo').removeClass('play').siblings('img').css('opacity', 1);
            }
        });

        $('.headerTrans .headerLogo').mouseenter(function(event) {
            if (!$(this).parent().hasClass('header-transparent')) {
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    $('.animatedLogo').addClass('play').siblings('img').css('opacity', 0);
                }, 300);
            }
        }).mouseleave(function(event) {
            if (!$(this).parent().hasClass('header-transparent')) {
                clearTimeout(timeout);
                $('.animatedLogo').removeClass('play').siblings('img').css('opacity', 1);
            }
        });
    }
    /* Header logo animation end */

    /* Menu begin */

    // header hamburger icon
    $(document).on('click', '#menuBtn', function(event) {
        event.preventDefault();
        $("#nav-toggle").toggleClass('active');
        $("#header").toggleClass('active');
        if ($("#nav-toggle").hasClass('active')) {
            $(this).find(".text").html("CLOSE");
        } else {
            $(this).find(".text").html("MENU");
        }
        toggleNav();
    });

    // menu content
    // Menu hover animations
    if (!isTouch) {
        $('.navLink').mouseenter(function(event) {
            $('.nav')
            var siblings = $(this).siblings();
            siblings.each(function(i, el) {
                var id = $(el).attr('id');
                $('#' + id + 'Img').velocity({
                    opacity: 0
                });
            });
            $('#' + $(this).attr('id') + 'Img').velocity({
                opacity: 1
            });
        });
    }
    /* Menu end */
    var toggleNav = function() {
        if (isOpen) {
            isOpen = false;
            $("#menu").velocity("fadeOut", {
                begin: function(elements) {
                    $("#logo-viewport").show();
                }
            });
        } else {
            isOpen = true;
            $("#menu").velocity("fadeIn", {
                complete: function(elements) {
                    $("#logo-viewport").hide();
                }
            });
        }
    }

    /* Init Full Page Begin */

    var initFullPage = function() {
        if ($('#fullpage').length) {
            // console.log('initFullPage');
            $('#fullpage').fullpage({
               
                navigation: true,
                loopTop: true,
                loopBottom: true,
                navigationPosition: 'right',
                
                recordHistory: true,
                afterLoad: function(anchorLink, index) {
                    var loadedSection = $(this);

                    //using index
                    if (index == 2) {
                        $('.ps2').addClass('animacijaHome');
                        $('.ps2').removeClass('animationStop');
                    }

                    if (index == 3) {
                        $('.ps3').addClass('animacijaHome');
                        $('.ps3').removeClass('animationStop');
                    }

                    if (index == 4) {
                        $('.ps0').addClass('animacijaHome');
                        $('.ps0').removeClass('animationStop');
                    }


                    //using anchorLink
                    if (anchorLink == 'secondSlide') {
                        alert("Section 2 ended loading");
                    }
                },

                onSlideLeave: function(index, nextIndex, direction) {
                    var leavingSection = $(this);

                    //after leaving section 2
                    if (index == 2 && direction == 'down') {
                        $('.ps2').addClass('animationStop').removeClass('active');
                    } else if (index == 2 && direction == 'up') {
                        $('.ps2').addClass('animationStop').removeClass('active');
                    }

                    if (index == 3 && direction == 'down') {
                        $('.ps3').addClass('animationStop').removeClass('active');
                    } else if (index == 3 && direction == 'up') {
                        $('.ps3').addClass('animationStop').removeClass('active');
                    }

                    if (index == 4 && direction == 'down') {
                        $('.ps0').addClass('animationStop').removeClass('active');
                    } else if (index == 4 && direction == 'up') {
                        $('.ps0').addClass('animationStop').removeClass('active');
                    }
                }
            });

            $('#fullpage .arrow').click(function(event) {
                var current = $(this);
                $('#fullpage').fullpage.moveTo(current.index('.arrow') + 2);
            });

        }
    }

    /* Init Full Page End */

    /* Global Init Begin */
    // function for initializing all the "document ready" code
    // for reinitialization purposes after reloading content via AJAX
    var init = function() {

            if (isOpen) {
                toggleNav();
            }

            if (window.location.pathname == '/') $('.footer').addClass('hidden');
            else $('.footer').removeClass('hidden');
            /*$('.preloader').css('position', 'absolute');
            $('.preloader').css("left", (($(window).width() / 2 - 50) + "px"));
            $('.preloader').css("top", (($(window).height() / 2 - 50) + "px"));*/


            if (!isTouch) {
                var helloSlider;

                $('.buttonHello a').mouseenter(function(event) {
                    $('.thankYou .overlay').animate({
                        opacity: 0.85,
                    }, 300, function() {
                        // Animation complete.
                    });
                    helloSlider = $('.thankYou .bxslider').bxSlider({
                        mode: 'fade',
                        speed: 400,
                        pager: false,
                        controls: false,
                        auto: true,
                        pause: 500
                    });
                }).mouseleave(function(event) {
                    $('.thankYou .overlay').animate({
                        opacity: 1,
                    }, 300, function() {
                        // Animation complete.
                    });
                    helloSlider.destroySlider();
                });
            }
            

            /* Slider Kiss Menu Android JS Begin */
            $('.slider-kma').bxSlider({
                speed: 1000, // Slide transition duration (in ms)
                slideMargin: 10,
                easing: 'ease',
                responsive: false,
                preloadImages: 'all',
                pager: false,
                controls: false,
                auto: true,
                pause: 1500, // The amount of time (in ms) between each auto transition
                autoDirection: 'prev',
                minSlides: 1,
                maxSlides: 9,
                moveSlides: 1,
                slideWidth: 324
            });
            /* Slider Kiss Menu Android JS End */

            /* Slider Kiss Menu iPhone JS Begin */
            $('.slider-kmi').bxSlider({
                speed: 1000, // Slide transition duration (in ms)
                slideMargin: 10,
                easing: 'ease',
                responsive: false,
                preloadImages: 'all',
                pager: false,
                controls: false,
                auto: true,
                pause: 1500, // The amount of time (in ms) between each auto transition
                // autoDirection: 'prev',
                minSlides: 1,
                maxSlides: 9,
                moveSlides: 1,
                slideWidth: 270
            });
            /* Slider Kiss Menu iPhone JS End */

            //twenty twenty
            $("#twentytwenty-container").twentytwenty();

            if (!isTouch) {
                //ZoomOnHover
                $('.nextProject').mouseenter(function(event) {
                    $(this).find('.nextProjectSlika').addClass('active2');
                    $('.section .blackOverlay').stop().fadeTo(250, 0.2);
                }).mouseleave(function(event) {
                    $(this).find('.nextProjectSlika').removeClass('active2');
                    $('.section .blackOverlay').stop().fadeTo(250, 0.7);
                });
            }

            //stop animation on wrapper hover   
            $('.pozicijaCentar .wrapper').mouseenter(function(event) {
                $('.ps2, .ps3, .ps0').removeClass('active').addClass('animationStop');
                clearTimeout(timeout);
                $(this).parent().parent().parent().find(".blackOverlay").stop().velocity({
                    opacity: 0.2
                });

            }).mouseleave(function(event) {
                $('.ps2, .ps3, .ps0').removeClass('animationStop').addClass('active');
                $(this).parent().parent().parent().find(".blackOverlay").stop().velocity({
                    opacity: 0.7
                });
            });

            //Video mbraintrain
            $('#mbrainvideo').on('click touchstart', function() {
                video = '<div class="responsiveYtVideo"><iframe width="100%" height="auto" frameBorder="0" src="' + $(this).attr('data-video') + '"></iframe></div>';
                $(this).replaceWith(video);
            });


        } // end init function

    /* Global Init End */

    /* GLOBAL end */


    /* HOME page begin */
    var logo = null;
    if ($('.home-page').length) {
        if (typeof cloudsFn === 'function') {
            if (Modernizr.mq('only all and (max-width: 768px)')) {
                $('#mobile-clouds').css('display', 'block');
            } else {
                $('#mobile-clouds').css('display', 'none');
                cloudsFn();
                logo = new Logo(config);
                logo.init();
            }
        }
    }
    /* HOME page end */

    /* WORK page begin */
    // Work section - bottom arrow click
    $('.coverPhoto .arrow').on('click touchstart', function(e) {
        e.preventDefault();
        $('html,body').animate({
            scrollTop: $(".projectInfo").offset().top
        });
    });

    /* Scroll Magic Begin */

    var scrollMagicController;
    var scrollMagicScene1;
    var scrollMagicScene2;
    var scrollMagicParallaxBgScene1;
    var scrollMagicParallaxBgScene2;
    var scrollMagicParallaxBgScene3;
    var scene;

    var tween;
    var tween1;
    var parallax_tween;
    var parallax_tween2;
    var parallax_tween3;

    var destroyScrollMagic = function() {
        // TODO: Luka cleanup
        if (typeof scrollMagicController != 'undefined' && scrollMagicController != null) scrollMagicController.destroy(1);
        if (typeof scrollMagicScene1 != 'undefined' && scrollMagicScene1 != null) scrollMagicScene1.destroy(1);
        if (typeof scrollMagicScene2 != 'undefined' && scrollMagicScene2 != null) scrollMagicScene2.destroy(1);
        if (typeof scrollMagicParallaxBgScene1 != 'undefined' && scrollMagicParallaxBgScene1 != null) scrollMagicParallaxBgScene1.destroy(1);
        if (typeof scrollMagicParallaxBgScene2 != 'undefined' && scrollMagicParallaxBgScene2 != null) scrollMagicParallaxBgScene2.destroy(1);
        if (typeof scrollMagicParallaxBgScene3 != 'undefined' && scrollMagicParallaxBgScene3 != null) scrollMagicParallaxBgScene3.destroy(1);
        if (typeof scene != 'undefined' && scene != null) scene.destroy();
        if (typeof scrollMagicController != 'undefined' && scrollMagicController != null) scrollMagicController = null;
        if (typeof scrollMagicScene1 != 'undefined' && scrollMagicScene1 != null) scrollMagicScene1 = null;
        if (typeof scrollMagicScene2 != 'undefined' && scrollMagicScene2 != null) scrollMagicScene2 = null;
        if (typeof scrollMagicParallaxBgScene1 != 'undefined' && scrollMagicParallaxBgScene1 != null) scrollMagicParallaxBgScene1 = null;
        if (typeof scrollMagicParallaxBgScene2 != 'undefined' && scrollMagicParallaxBgScene2 != null) scrollMagicParallaxBgScene2 = null;
        if (typeof scrollMagicParallaxBgScene3 != 'undefined' && scrollMagicParallaxBgScene3 != null) scrollMagicParallaxBgScene3 = null;
        if (typeof scene != 'undefined' && scene != null) scene = null;

        // tweens
        tween = null;
        tween1 = null;
        parallax_tween = null;
        parallax_tween2 = null;
        parallax_tween3 = null;
    }

    var initScrollMagic = function() {
        scrollMagicController = new ScrollMagic();

        if ($('.coverPhoto').length) {
            var tween1 = TweenMax.to(".coverPhotoOverlay", 1, {
                opacity: 1
            });
            var cover_photo_height = $(".coverPhoto").height();
            // window height
            var window_height = $(window).height();
            if (window_height < cover_photo_height) {
                cover_photo_height = window_height;
            }
            scrollMagicScene1 = new ScrollScene({
                    duration: cover_photo_height
                })
                .setTween(tween1)
                .addTo(scrollMagicController);
        }


        var window_width = $(window).width();
        if ($(".parallax-wrapper").length && window_width > 1024) {



            $(".parallax-placeholder").height(window_height);
            $(".parallax-bg").height(window_height);
            $(".parallax-wrapper").height(window_height);


            var scenes_count = $(".parallax-wrapper").attr("data-scenes");
            console.log(scenes_count);
            var parallax_height = $(".parallax-placeholder").height() * scenes_count;

            scrollMagicScene2 = new ScrollScene({
                    triggerElement: "#parallax-trigger1",
                    triggerHook: "onEnter",
                    duration: parallax_height
                })
                .setPin(".parallax-wrapper")
                .addTo(scrollMagicController);

            parallax_tween = TweenMax.to("#parallax-bg1", 0.5, {
                height: 0
            });
            scrollMagicParallaxBgScene1 = new ScrollScene({
                    triggerElement: "#parallax-trigger1",
                    triggerHook: "onEnter",
                    duration: window_height
                })
                .setTween(parallax_tween).addTo(scrollMagicController);

            parallax_tween2 = TweenMax.to("#parallax-bg2", 0.5, {
                height: 0
            });
            scrollMagicParallaxBgScene2 = new ScrollScene({
                    triggerElement: "#parallax-trigger2",
                    triggerHook: "onEnter",
                    duration: window_height
                })
                .setTween(parallax_tween2).addTo(scrollMagicController);
            if (scenes_count > 2) {
                parallax_tween3 = TweenMax.to("#parallax-bg3", 0.5, {
                    height: 0
                });
                scrollMagicParallaxBgScene3 = new ScrollScene({
                        triggerElement: "#parallax-trigger3",
                        triggerHook: "onEnter",
                        duration: window_height
                    })
                    .setTween(parallax_tween3).addTo(scrollMagicController);
            }

        }
        // images fade in 
        $(".project-image").each(function(index, element) {
            tween = TweenMax.to(element, 0.5, {
                opacity: 1,
                marginTop: 0
            });
            scene = new ScrollScene({
                    triggerElement: element,
                    triggerHook: 1
                })
                .setTween(tween)
                .addTo(scrollMagicController);
        });

    }

    /* Scroll Magic End */
    /* WORK page end */

    /* PROFILE page begin */
    // inline call
    /* PROFILE page end */

    /* CONTACT page begin */
    // none
    /* CONTACT page end */

    initFullPage();
    init();

    $(window).resize(function() {
        // TODO: Luka cleanup
        var window_width = $(window).width();
        destroyScrollMagic();
        if (window_width > 1024) {
            initScrollMagic();
        }
    });

    $(window).load(function() {
        // TODO: Luka cleanup
        // 
        var window_width = $(window).width();
        $("#menu").css("display", "none");
        $('.preloader-wrapper').fadeOut(function() {
            if (window_width > 1024) {
                initScrollMagic();
            }
            $("body").removeClass("unscrollable");
        });
    });

});