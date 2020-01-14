"use strict";
(function () {
  // Global variables
  var
    userAgent = navigator.userAgent.toLowerCase(),
    initialDate = new Date(),

    $document = $(document),
    $window = $(window),
    $html = $("html"),
    $body = $("body"),

    isDesktop = $html.hasClass("desktop"),
    isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false,
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    windowReady = false,

    plugins = {
      bootstrapTooltip:        $( '[data-toggle="tooltip"]' ),
      bootstrapModal:          $( '.modal' ),
      bootstrapTabs:           $( '.tabs-custom' ),
      captcha:                 $( '.recaptcha' ),
      campaignMonitor:         $( '.campaign-mailform' ),
      copyrightYear:           $( '.copyright-year' ),
      checkbox:                $( 'input[type="checkbox"]' ),
      lightGallery:            $( '[data-lightgallery="group"]' ),
      lightGalleryItem:        $( '[data-lightgallery="item"]' ),
      lightDynamicGalleryItem: $( '[data-lightgallery="dynamic"]' ),
      materialParallax:        $( '.parallax-container' ),
      mailchimp:               $( '.mailchimp-mailform' ),
      popover:                 $( '[data-toggle="popover"]' ),
      preloader:               $( '.preloader' ),
      rdNavbar:                $( '.rd-navbar' ),
      rdMailForm:              $( '.rd-mailform' ),
      rdInputLabel:            $( '.form-label' ),
      regula:                  $( '[data-constraints]' ),
      radio:                   $( 'input[type="radio"]' ),
      search:                  $( '.rd-search' ),
      searchResults:           $( '.rd-search-results' ),
      statefulButton:          $( '.btn-stateful' ),
      viewAnimate:             $( '.view-animate' ),
      wow:                     $( '.wow' ),
      maps:                    $( '.google-map-container' ),
      dataSplitting:           $('[data-splitting]'),
      selectFilter:            $("select"),
      slick:                   $('.slick-slider'),
      swiper:                  document.querySelectorAll( '.swiper-container' ),
      counter:                 document.querySelectorAll( '.counter' ),
      progressLinear:          document.querySelectorAll( '.progress-linear' ),
      progressCircle:          document.querySelectorAll( '.progress-circle' ),
      countdown:               document.querySelectorAll( '.countdown' ),
      waves:                   document.querySelectorAll('.waves')
    };

  /**
   * @desc Check the element was been scrolled into the view
   * @param {object} elem - jQuery object
   * @return {boolean}
   */
  function isScrolledIntoView ( elem ) {
    return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
  }

  /**
   * @desc Calls a function when element has been scrolled into the view
   * @param {object} element - jQuery object
   * @param {function} func - init function
   */
  function lazyInit( element, func ) {
    var scrollHandler = function () {
      if ( ( !element.hasClass( 'lazy-loaded' ) && ( isScrolledIntoView( element ) ) ) ) {
        func.call( element );
        element.addClass( 'lazy-loaded' );
      }
    };

    scrollHandler();
    $window.on( 'scroll', scrollHandler );
  }

  // Initialize scripts that require a loaded window
  $window.on('load', function () {


    // Page loader & Page transition
    if (plugins.preloader.length) {
      pageTransition({
        target: document.querySelector( '.page' ),
        delay: 0,
        duration: 500,
        classIn: 'fadeIn',
        classOut: 'fadeOut',
        classActive: 'completed',
        conditions: function (event, link) {
          return link && !/(\#|javascript:void\(0\)|callto:|tel:|mailto:|:\/\/)/.test(link) && !event.currentTarget.hasAttribute('data-lightgallery');
        },
        onTransitionStart: function ( options ) {
          setTimeout( function () {
            plugins.preloader.removeClass('loaded');
          }, options.duration * .75 );
        },
        onReady: function () {
          plugins.preloader.addClass('loaded');
          windowReady = true;
        }
      });
    }

    // WOW
    if ( plugins.wow.length && isDesktop ) {
      new WOW({
        offset: -100,
      }).init();
    }

    // Counter
    if ( plugins.counter ) {
      for ( var i = 0; i < plugins.counter.length; i++ ) {
        var
          node = plugins.counter[i],
          counter = aCounter({
            node: node,
            duration: node.getAttribute( 'data-duration' ) || 1000
          }),
          scrollHandler = (function() {
            if ( Util.inViewport( this ) && !this.classList.contains( 'animated-first' ) ) {
              this.counter.run();
              this.classList.add( 'animated-first' );
            }
          }).bind( node ),
          blurHandler = (function() {
            this.counter.params.to = parseInt( this.textContent, 10 );
            this.counter.run();
          }).bind( node );


          scrollHandler();
          window.addEventListener( 'scroll', scrollHandler );
      }
    }

    // Progress Bar
    if ( plugins.progressLinear ) {
      for ( var i = 0; i < plugins.progressLinear.length; i++ ) {
        var
          container = plugins.progressLinear[i],
          counter = aCounter({
            node: container.querySelector( '.progress-linear-counter' ),
            duration: container.getAttribute( 'data-duration' ) || 1000,
            onStart: function() {
              this.custom.bar.style.width = this.params.to + '%';
            }
          });

        counter.custom = {
          container: container,
          bar: container.querySelector( '.progress-linear-bar' ),
          onScroll: (function() {
            if ( ( Util.inViewport( this.custom.container ) && !this.custom.container.classList.contains( 'animated' ) ) ) {
              this.run();
              this.custom.container.classList.add( 'animated' );
            }
          }).bind( counter ),
          onBlur: (function() {
            this.params.to = parseInt( this.params.node.textContent, 10 );
            this.run();
          }).bind( counter )
        };

        counter.custom.onScroll();
        document.addEventListener( 'scroll', counter.custom.onScroll );
      }
    }

    // Progress Circle
    if ( plugins.progressCircle ) {
      for ( var i = 0; i < plugins.progressCircle.length; i++ ) {
        var
          container = plugins.progressCircle[i],
          counter = aCounter({
            node: container.querySelector( '.progress-circle-counter' ),
            duration: 500,
            onUpdate: function( value ) {
              this.custom.bar.render( value * 3.6 );
            }
          });

        counter.params.onComplete = counter.params.onUpdate;

        counter.custom = {
          container: container,
          bar: aProgressCircle({ node: container.querySelector( '.progress-circle-bar' ) }),
          onScroll: (function() {
            if ( Util.inViewport( this.custom.container ) && !this.custom.container.classList.contains( 'animated' ) ) {
              this.run();
              this.custom.container.classList.add( 'animated' );
            }
          }).bind( counter ),
          onBlur: (function() {
            this.params.to = parseInt( this.params.node.textContent, 10 );
            this.run();
          }).bind( counter )
        };

        counter.custom.onScroll();
        window.addEventListener( 'scroll', counter.custom.onScroll );
      }
    }

    // Spliting
    if ( plugins.dataSplitting.length && isDesktop ) {
      Splitting();
    }

    // Triangle
    function triangleCreate ( element ) {
      for ( var i = 0; i < element.length; i++ ) {
        var node = $( element[ i ] );
        var triangle = node.find( $( node.data('triangle' ) ) );

        var triangleWidth = node.innerWidth();
        var triangleHeight = node.innerHeight();

        triangle.css({
          'border-top-width'  : triangleHeight+'px',
          'border-left-width' : triangleWidth+'px'
        });
      }
    }
    var elementWithTriangleRight = $( '[data-triangle]' );
    if ( elementWithTriangleRight.length ) {
      triangleCreate( elementWithTriangleRight );
      $window.on( 'resize orientationchange' , function () {
        triangleCreate( elementWithTriangleRight );
      });
    }

    if ( plugins.waves.length ) {
      for ( var i = 0; i < plugins.waves.length; i++ ) {
        var wave = plugins.waves[i];
        var waves = new SineWaves({
          el: wave,
          speed: wave.getAttribute('data-speed') ||5,
          width: function() {
            return $(window).width();
          },

          height: function() {
            return $(window).height();
          },

          ease: wave.getAttribute('data-animation') || 'SineInOut',
          wavesWidth: wave.getAttribute('data-wave-width') || '150%',
          waves: [
            {
              timeModifier: 0.6,
              lineWidth: 5,
              amplitude: -200,
              wavelength: 200
            },
            {
              timeModifier: 0.13,
              lineWidth: 5,
              amplitude: -300,
              wavelength: 300
            }
          ],

          // Called on window resize
          resizeEvent: function() {
            var gradient1 = this.ctx.createLinearGradient(0, 0, this.width, 0);
            gradient1.addColorStop(0,"rgba(0, 172, 238, 1)");
            gradient1.addColorStop(0.54,"rgba(239, 165, 6, 1)");
            gradient1.addColorStop(1,"rgba(236, 57, 139, 1)");

            var gradient2 = this.ctx.createLinearGradient(0, 0, this.width, 0);
            gradient2.addColorStop(0,"rgba(32, 171, 208, 1)");
            gradient2.addColorStop(0.50,"rgba(83, 72, 182, 1)");
            gradient2.addColorStop(1,"rgba(234, 8, 140, 1)");

            var index = -1;
            var length = this.waves.length;
            while(++index < length){
              if ( index === 0 ) {
                this.waves[index].strokeStyle = gradient1;
              }
              else {
                this.waves[index].strokeStyle = gradient2;
              }
            }

            // Clean Up
            index = void 0;
            length = void 0;
            gradient1 = void 0;
            gradient2 = void 0;
          }
        });

        $window.scroll(function () {
          if ( !isScrolledIntoView( $(wave) ) ) {
            waves.running = false;
            waves.update();
          } else {
            waves.running = true;
            waves.update();
          }
        });
      }


    }
  });

  // Initialize scripts that require a finished document
  $(function () {

    /**
     * @desc Sets the actual previous index based on the position of the slide in the markup. Should be the most recent action.
     * @param {object} swiper - swiper instance
     */
    function setRealPrevious( swiper ) {
      var element = swiper.$wrapperEl[0].children[ swiper.activeIndex ];
      swiper.realPrevious = Array.prototype.indexOf.call( element.parentNode.children, element );
    }

    /**
     * @desc Sets slides background images from attribute 'data-slide-bg'
     * @param {object} swiper - swiper instance
     */
    function setBackgrounds( swiper ) {
      var swiperSlides = swiper.el.querySelectorAll( '[data-slide-bg]' );
      for (var i = 0; i < swiperSlides.length; i++) {
        var swiperSlide = swiperSlides[i];
        swiperSlide.style.backgroundImage = 'url('+ swiperSlide.getAttribute( 'data-slide-bg' ) +')';
      }
    }

    /**
     * @desc Animate captions on active slides
     * @param {object} swiper - swiper instance
     */
    function initCaptionAnimate( swiper ) {
      var
        animate = function ( caption ) {
          return function() {
            var duration;
            if ( duration = caption.getAttribute( 'data-caption-duration' ) ) caption.style.animationDuration = duration +'ms';
            caption.classList.remove( 'not-animated' );
            caption.classList.add( caption.getAttribute( 'data-caption-animate' ) );
            caption.classList.add( 'animated' );
          };
        },
        initializeAnimation = function ( captions ) {
          for ( var i = 0; i < captions.length; i++ ) {
            var caption = captions[i];
            caption.classList.remove( 'animated' );
            caption.classList.remove( caption.getAttribute( 'data-caption-animate' ) );
            caption.classList.add( 'not-animated' );
          }
        },
        finalizeAnimation = function ( captions ) {
          for ( var i = 0; i < captions.length; i++ ) {
            var caption = captions[i];
            if ( caption.getAttribute( 'data-caption-delay' ) ) {
              setTimeout( animate( caption ), Number( caption.getAttribute( 'data-caption-delay' ) ) );
            } else {
              animate( caption )();
            }
          }
        };

      // Caption parameters
      swiper.params.caption = {
        animationEvent: 'slideChangeTransitionEnd'
      };

      initializeAnimation( swiper.$wrapperEl[0].querySelectorAll( '[data-caption-animate]' ) );
      finalizeAnimation( swiper.$wrapperEl[0].children[ swiper.activeIndex ].querySelectorAll( '[data-caption-animate]' ) );

      if ( swiper.params.caption.animationEvent === 'slideChangeTransitionEnd' ) {
        swiper.on( swiper.params.caption.animationEvent, function() {
          initializeAnimation( swiper.$wrapperEl[0].children[ swiper.previousIndex ].querySelectorAll( '[data-caption-animate]' ) );
          finalizeAnimation( swiper.$wrapperEl[0].children[ swiper.activeIndex ].querySelectorAll( '[data-caption-animate]' ) );
        });
      } else {
        swiper.on( 'slideChangeTransitionEnd', function() {
          initializeAnimation( swiper.$wrapperEl[0].children[ swiper.previousIndex ].querySelectorAll( '[data-caption-animate]' ) );
        });

        swiper.on( swiper.params.caption.animationEvent, function() {
          finalizeAnimation( swiper.$wrapperEl[0].children[ swiper.activeIndex ].querySelectorAll( '[data-caption-animate]' ) );
        });
      }
    }

    /**
     * @desc Create live search results
     * @param {object} options
     */
    function liveSearch(options) {
      $('#' + options.live).removeClass('cleared').html();
      options.current++;
      options.spin.addClass('loading');
      $.get(handler, {
        s: decodeURI(options.term),
        liveSearch: options.live,
        dataType: "html",
        liveCount: options.liveCount,
        filter: options.filter,
        template: options.template
      }, function (data) {
        options.processed++;
        var live = $('#' + options.live);
        if ((options.processed === options.current) && !live.hasClass('cleared')) {
          live.find('> #search-results').removeClass('active');
          live.html(data);
          setTimeout(function () {
            live.find('> #search-results').addClass('active');
          }, 50);
        }
        options.spin.parents('.rd-search').find('.input-group-addon').removeClass('loading');
      })
    }

    /**
     * @desc Attach form validation to elements
     * @param {object} elements - jQuery object
     */
    function attachFormValidator(elements) {
      // Custom validator - phone number
      regula.custom({
        name: 'PhoneNumber',
        defaultMessage: 'Invalid phone number format',
        validator: function() {
          if ( this.value === '' ) return true;
          else return /^(\+\d)?[0-9\-\(\) ]{5,}$/i.test( this.value );
        }
      });

      for (var i = 0; i < elements.length; i++) {
        var o = $(elements[i]), v;
        o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
        v = o.parent().find(".form-validation");
        if (v.is(":last-child")) o.addClass("form-control-last-child");
      }

      elements.on('input change propertychange blur', function (e) {
        var $this = $(this), results;

        if (e.type !== "blur") if (!$this.parent().hasClass("has-error")) return;
        if ($this.parents('.rd-mailform').hasClass('success')) return;

        if (( results = $this.regula('validate') ).length) {
          for (i = 0; i < results.length; i++) {
            $this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error");
          }
        } else {
          $this.siblings(".form-validation").text("").parent().removeClass("has-error")
        }
      }).regula('bind');

      var regularConstraintsMessages = [
        {
          type: regula.Constraint.Required,
          newMessage: "The text field is required."
        },
        {
          type: regula.Constraint.Email,
          newMessage: "The email is not a valid email."
        },
        {
          type: regula.Constraint.Numeric,
          newMessage: "Only numbers are required"
        },
        {
          type: regula.Constraint.Selected,
          newMessage: "Please choose an option."
        }
      ];


      for (var i = 0; i < regularConstraintsMessages.length; i++) {
        var regularConstraint = regularConstraintsMessages[i];

        regula.override({
          constraintType: regularConstraint.type,
          defaultMessage: regularConstraint.newMessage
        });
      }
    }

    /**
     * @desc Check if all elements pass validation
     * @param {object} elements - object of items for validation
     * @param {object} captcha - captcha object for validation
     * @return {boolean}
     */
    function isValidated(elements, captcha) {
      var results, errors = 0;

      if (elements.length) {
        for (var j = 0; j < elements.length; j++) {

          var $input = $(elements[j]);
          if ((results = $input.regula('validate')).length) {
            for (k = 0; k < results.length; k++) {
              errors++;
              $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
            }
          } else {
            $input.siblings(".form-validation").text("").parent().removeClass("has-error")
          }
        }

        if (captcha) {
          if (captcha.length) {
            return validateReCaptcha(captcha) && errors === 0
          }
        }

        return errors === 0;
      }
      return true;
    }

    /**
     * @desc Validate google reCaptcha
     * @param {object} captcha - captcha object for validation
     * @return {boolean}
     */
    function validateReCaptcha(captcha) {
      var captchaToken = captcha.find('.g-recaptcha-response').val();

      if (captchaToken.length === 0) {
        captcha
          .siblings('.form-validation')
          .html('Please, prove that you are not robot.')
          .addClass('active');
        captcha
          .closest('.form-wrap')
          .addClass('has-error');

        captcha.on('propertychange', function () {
          var $this = $(this),
            captchaToken = $this.find('.g-recaptcha-response').val();

          if (captchaToken.length > 0) {
            $this
              .closest('.form-wrap')
              .removeClass('has-error');
            $this
              .siblings('.form-validation')
              .removeClass('active')
              .html('');
            $this.off('propertychange');
          }
        });

        return false;
      }

      return true;
    }

    /**
     * @desc Initialize Google reCaptcha
     */
    window.onloadCaptchaCallback = function () {
      for (var i = 0; i < plugins.captcha.length; i++) {
        var
          $captcha = $(plugins.captcha[i]),
          resizeHandler = (function() {
            var
              frame = this.querySelector( 'iframe' ),
              inner = this.firstElementChild,
              inner2 = inner.firstElementChild,
              containerRect = null,
              frameRect = null,
              scale = null;

            inner2.style.transform = '';
            inner.style.height = 'auto';
            inner.style.width = 'auto';

            containerRect = this.getBoundingClientRect();
            frameRect = frame.getBoundingClientRect();
            scale = containerRect.width/frameRect.width;

            if ( scale < 1 ) {
              inner2.style.transform = 'scale('+ scale +')';
              inner.style.height = ( frameRect.height * scale ) + 'px';
              inner.style.width = ( frameRect.width * scale ) + 'px';
            }
          }).bind( plugins.captcha[i] );

        grecaptcha.render(
          $captcha.attr('id'),
          {
            sitekey: $captcha.attr('data-sitekey'),
            size: $captcha.attr('data-size') ? $captcha.attr('data-size') : 'normal',
            theme: $captcha.attr('data-theme') ? $captcha.attr('data-theme') : 'light',
            callback: function () {
              $('.recaptcha').trigger('propertychange');
            }
          }
        );

        $captcha.after("<span class='form-validation'></span>");

        if ( plugins.captcha[i].hasAttribute( 'data-auto-size' ) ) {
          resizeHandler();
          window.addEventListener( 'resize', resizeHandler );
        }
      }
    };

    /**
     * @desc Initialize Bootstrap tooltip with required placement
     * @param {string} tooltipPlacement
     */
    function initBootstrapTooltip(tooltipPlacement) {
      plugins.bootstrapTooltip.tooltip('dispose');

      if (window.innerWidth < 576) {
        plugins.bootstrapTooltip.tooltip({placement: 'bottom'});
      } else {
        plugins.bootstrapTooltip.tooltip({placement: tooltipPlacement});
      }
    }

    /**
     * @desc Initialize the gallery with set of images
     * @param {object} itemsToInit - jQuery object
     * @param {string} [addClass] - additional gallery class
     */
    function initLightGallery ( itemsToInit, addClass ) {
      $( itemsToInit ).lightGallery( {
        thumbnail: $( itemsToInit ).attr( "data-lg-thumbnail" ) !== "false",
        selector: "[data-lightgallery='item']",
        autoplay: $( itemsToInit ).attr( "data-lg-autoplay" ) === "true",
        pause: parseInt( $( itemsToInit ).attr( "data-lg-autoplay-delay" ) ) || 5000,
        addClass: addClass,
        mode: $( itemsToInit ).attr( "data-lg-animation" ) || "lg-slide",
        loop: $( itemsToInit ).attr( "data-lg-loop" ) !== "false"
      } );
    }

    /**
     * @desc Initialize the gallery with dynamic addition of images
     * @param {object} itemsToInit - jQuery object
     * @param {string} [addClass] - additional gallery class
     */
    function initDynamicLightGallery ( itemsToInit, addClass ) {
      $( itemsToInit ).on( "click", function () {
        $( itemsToInit ).lightGallery( {
          thumbnail: $( itemsToInit ).attr( "data-lg-thumbnail" ) !== "false",
          selector: "[data-lightgallery='item']",
          autoplay: $( itemsToInit ).attr( "data-lg-autoplay" ) === "true",
          pause: parseInt( $( itemsToInit ).attr( "data-lg-autoplay-delay" ) ) || 5000,
          addClass: addClass,
          mode: $( itemsToInit ).attr( "data-lg-animation" ) || "lg-slide",
          loop: $( itemsToInit ).attr( "data-lg-loop" ) !== "false",
          dynamic: true,
          dynamicEl: JSON.parse( $( itemsToInit ).attr( "data-lg-dynamic-elements" ) ) || []
        } );
      } );
    }

    /**
     * @desc Initialize the gallery with one image
     * @param {object} itemToInit - jQuery object
     * @param {string} [addClass] - additional gallery class
     */
    function initLightGalleryItem ( itemToInit, addClass ) {
      $( itemToInit ).lightGallery( {
        selector: "this",
        addClass: addClass,
        counter: false,
        youtubePlayerParams: {
          modestbranding: 1,
          showinfo: 0,
          rel: 0,
          controls: 0
        },
        vimeoPlayerParams: {
          byline: 0,
          portrait: 0
        }
      } );
    }

    /**
     * @desc Google map function for getting latitude and longitude
     */
    function getLatLngObject(str, marker, map, callback) {
      var coordinates = {};
      try {
        coordinates = JSON.parse(str);
        callback(new google.maps.LatLng(
          coordinates.lat,
          coordinates.lng
        ), marker, map)
      } catch (e) {
        map.geocoder.geocode({'address': str}, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();

            callback(new google.maps.LatLng(
              parseFloat(latitude),
              parseFloat(longitude)
            ), marker, map)
          }
        })
      }
    }

    /**
     * @desc Initialize Google maps
     */
    function initMaps() {
      var key;

      for ( var i = 0; i < plugins.maps.length; i++ ) {
        if ( plugins.maps[i].hasAttribute( "data-key" ) ) {
          key = plugins.maps[i].getAttribute( "data-key" );
          break;
        }
      }

      $.getScript('//maps.google.com/maps/api/js?'+ ( key ? 'key='+ key + '&' : '' ) +'sensor=false&libraries=geometry,places&v=quarterly', function () {
        var head = document.getElementsByTagName('head')[0],
          insertBefore = head.insertBefore;

        head.insertBefore = function (newElement, referenceElement) {
          if (newElement.href && newElement.href.indexOf('//fonts.googleapis.com/css?family=Roboto') !== -1 || newElement.innerHTML.indexOf('gm-style') !== -1) {
            return;
          }
          insertBefore.call(head, newElement, referenceElement);
        };
        var geocoder = new google.maps.Geocoder;
        for (var i = 0; i < plugins.maps.length; i++) {
          var zoom = parseInt(plugins.maps[i].getAttribute("data-zoom"), 10) || 11;
          var styles = plugins.maps[i].hasAttribute('data-styles') ? JSON.parse(plugins.maps[i].getAttribute("data-styles")) : [];
          var center = plugins.maps[i].getAttribute("data-center") || "New York";

          // Initialize map
          var map = new google.maps.Map(plugins.maps[i].querySelectorAll(".google-map")[0], {
            zoom: zoom,
            styles: styles,
            scrollwheel: false,
            center: {lat: 0, lng: 0}
          });

          // Add map object to map node
          plugins.maps[i].map = map;
          plugins.maps[i].geocoder = geocoder;
          plugins.maps[i].keySupported = true;
          plugins.maps[i].google = google;

          // Get Center coordinates from attribute
          getLatLngObject(center, null, plugins.maps[i], function (location, markerElement, mapElement) {
            mapElement.map.setCenter(location);
          });

          // Add markers from google-map-markers array
          var markerItems = plugins.maps[i].querySelectorAll(".google-map-markers li");

          if (markerItems.length){
            var markers = [];
            for (var j = 0; j < markerItems.length; j++){
              var markerElement = markerItems[j];
              getLatLngObject(markerElement.getAttribute("data-location"), markerElement, plugins.maps[i], function(location, markerElement, mapElement){
                var icon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
                var activeIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active");
                var info = markerElement.getAttribute("data-description") || "";
                var infoWindow = new google.maps.InfoWindow({
                  content: info
                });
                markerElement.infoWindow = infoWindow;
                var markerData = {
                  position: location,
                  map: mapElement.map
                }
                if (icon){
                  markerData.icon = icon;
                }
                var marker = new google.maps.Marker(markerData);
                markerElement.gmarker = marker;
                markers.push({markerElement: markerElement, infoWindow: infoWindow});
                marker.isActive = false;
                // Handle infoWindow close click
                google.maps.event.addListener(infoWindow,'closeclick',(function(markerElement, mapElement){
                  var markerIcon = null;
                  markerElement.gmarker.isActive = false;
                  markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
                  markerElement.gmarker.setIcon(markerIcon);
                }).bind(this, markerElement, mapElement));


                // Set marker active on Click and open infoWindow
                google.maps.event.addListener(marker, 'click', (function(markerElement, mapElement) {
                  if (markerElement.infoWindow.getContent().length === 0) return;
                  var gMarker, currentMarker = markerElement.gmarker, currentInfoWindow;
                  for (var k =0; k < markers.length; k++){
                    var markerIcon;
                    if (markers[k].markerElement === markerElement){
                      currentInfoWindow = markers[k].infoWindow;
                    }
                    gMarker = markers[k].markerElement.gmarker;
                    if (gMarker.isActive && markers[k].markerElement !== markerElement){
                      gMarker.isActive = false;
                      markerIcon = markers[k].markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")
                      gMarker.setIcon(markerIcon);
                      markers[k].infoWindow.close();
                    }
                  }

                  currentMarker.isActive = !currentMarker.isActive;
                  if (currentMarker.isActive) {
                    if (markerIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active")){
                      currentMarker.setIcon(markerIcon);
                    }

                    currentInfoWindow.open(map, marker);
                  }else{
                    if (markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")){
                      currentMarker.setIcon(markerIcon);
                    }
                    currentInfoWindow.close();
                  }
                }).bind(this, markerElement, mapElement))
              })
            }
          }
        }
      });
    }

    // Google ReCaptcha
    if (plugins.captcha.length) {
      $.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
    }

    // Additional class on html if mac os.
    if (navigator.platform.match(/(Mac)/i)) {
      $html.addClass("mac-os");
    }

    // Adds some loosing functionality to IE browsers (IE Polyfills)
    if (isIE) {
      if (isIE === 12) $html.addClass("ie-edge");
      if (isIE === 11) $html.addClass("ie-11");
      if (isIE < 10) $html.addClass("lt-ie-10");
      if (isIE < 11) $html.addClass("ie-10");
    }

    // Bootstrap Tooltips
    if (plugins.bootstrapTooltip.length) {
      var tooltipPlacement = plugins.bootstrapTooltip.attr('data-placement');
      initBootstrapTooltip(tooltipPlacement);

      $window.on('resize orientationchange', function () {
        initBootstrapTooltip(tooltipPlacement);
      })
    }

    // Bootstrap Modal
    if (plugins.bootstrapModal.length) {
      for (var i = 0; i < plugins.bootstrapModal.length; i++) {
        var modalItem = $(plugins.bootstrapModal[i]);

        modalItem.on('hidden.bs.modal', $.proxy(function () {
          var activeModal = $(this),
            rdVideoInside = activeModal.find('video'),
            youTubeVideoInside = activeModal.find('iframe');

          if (rdVideoInside.length) {
            rdVideoInside[0].pause();
          }

          if (youTubeVideoInside.length) {
            var videoUrl = youTubeVideoInside.attr('src');

            youTubeVideoInside
              .attr('src', '')
              .attr('src', videoUrl);
          }
        }, modalItem))
      }
    }

    // Popovers
    if (plugins.popover.length) {
      if (window.innerWidth < 767) {
        plugins.popover.attr('data-placement', 'bottom');
        plugins.popover.popover();
      }
      else {
        plugins.popover.popover();
      }
    }

    // Bootstrap tabs
    if (plugins.bootstrapTabs.length) {
      for (var i = 0; i < plugins.bootstrapTabs.length; i++) {
        var bootstrapTab = $(plugins.bootstrapTabs[i]);

        //If have slick carousel inside tab - resize slick carousel on click
        if (bootstrapTab.find('.slick-slider').length) {
          bootstrapTab.find('.tabs-custom-list > li > a').on('click', $.proxy(function () {
            var $this = $(this);
            var setTimeOutTime = 300;

            setTimeout(function () {
              $this.find('.tab-content .tab-pane.active .slick-slider').slick('setPosition');
            }, setTimeOutTime);
          }, bootstrapTab));
        }

        var tabs = plugins.bootstrapTabs[i].querySelectorAll( '.nav li a' );

        for ( var t = 0; t < tabs.length; t++ ) {
          var tab = tabs[ t ];

          if ( t === 0 ) {
            tab.parentElement.classList.remove( 'active' );
            $( tab ).tab( 'show' );
          }

          tab.addEventListener( 'click', function( event ) {
            event.preventDefault();
            $( this ).tab( 'show' );
          });
        }
      }
    }

    // Bootstrap Buttons
    if (plugins.statefulButton.length) {
      $(plugins.statefulButton).on('click', function () {
        var statefulButtonLoading = $(this).button('loading');

        setTimeout(function () {
          statefulButtonLoading.button('reset')
        }, 2000);
      })
    }


    // Copyright Year (Evaluates correct copyright year)
    if (plugins.copyrightYear.length) {
      plugins.copyrightYear.text(initialDate.getFullYear());
    }

    // Google maps
    if( plugins.maps.length ) {
      lazyInit( plugins.maps, initMaps );
    }

    // UI To Top
    if (isDesktop) {
      $().UItoTop({
        easingType: 'easeOutQuad',
        containerClass: 'ui-to-top fa fa-angle-up'
      });
    }

    // RD Navbar
    if ( plugins.rdNavbar.length ) {
      var
        navbar = plugins.rdNavbar,
        aliases = { '-': 0, '-sm-': 576, '-md-': 768, '-lg-': 992, '-xl-': 1200, '-xxl-': 1600 },
        responsive = {};

      for ( var alias in aliases ) {
        var link = responsive[ aliases[ alias ] ] = {};
        if ( navbar.attr( 'data'+ alias +'layout' ) )          link.layout        = navbar.attr( 'data'+ alias +'layout' );
        if ( navbar.attr( 'data'+ alias +'device-layout' ) )   link.deviceLayout  = navbar.attr( 'data'+ alias +'device-layout' );
        if ( navbar.attr( 'data'+ alias +'hover-on' ) )        link.focusOnHover  = navbar.attr( 'data'+ alias +'hover-on' ) === 'true';
        if ( navbar.attr( 'data'+ alias +'auto-height' ) )     link.autoHeight    = navbar.attr( 'data'+ alias +'auto-height' ) === 'true';
        if ( navbar.attr( 'data'+ alias +'stick-up-offset' ) ) link.stickUpOffset = navbar.attr( 'data'+ alias +'stick-up-offset' );
        if ( navbar.attr( 'data'+ alias +'stick-up' ) )        link.stickUp       = navbar.attr( 'data'+ alias +'stick-up' ) === 'true';
        else if ( navbar.attr( 'data'+ alias +'stick-up' ) )   link.stickUp       = navbar.attr( 'data'+ alias +'stick-up' ) === 'true';
      }

      plugins.rdNavbar.RDNavbar({
        anchorNav: true,
        stickUpClone: ( plugins.rdNavbar.attr("data-stick-up-clone") ) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
        responsive: responsive,
        autoHeight: false,
        callbacks: {
          onStuck: function () {
            var navbarSearch = this.$element.find('.rd-search input');

            if (navbarSearch) {
              navbarSearch.val('').trigger('propertychange');
            }
          },
          onDropdownOver: function () {
            return true;
          },
          onUnstuck: function () {
            if (this.$clone === null)
              return;

            var navbarSearch = this.$clone.find('.rd-search input');

            if (navbarSearch) {
              navbarSearch.val('').trigger('propertychange');
              navbarSearch.trigger('blur');
            }
          }
        }
      });

      var currentScroll = 0;
      $window.scroll( function(event) {
        var nextScroll = $(this).scrollTop();

        if ( nextScroll > currentScroll ) {
          plugins.rdNavbar.addClass('scroll-bottom');
        } else {
          plugins.rdNavbar.removeClass('scroll-bottom');
        }

        currentScroll = nextScroll;
      })

    }

    // RD Search
    if (plugins.search.length || plugins.searchResults) {
      var handler = "bat/rd-search.php";
      var defaultTemplate = '<h5 class="search-title"><a target="_top" href="#{href}" class="search-link">#{title}</a></h5>' +
        '<p>...#{token}...</p>' +
        '<p class="match"><em>Terms matched: #{count} - URL: #{href}</em></p>';
      var defaultFilter = '*.html';

      if (plugins.search.length) {
        for (var i = 0; i < plugins.search.length; i++) {
          var searchItem = $(plugins.search[i]),
            options = {
              element: searchItem,
              filter: (searchItem.attr('data-search-filter')) ? searchItem.attr('data-search-filter') : defaultFilter,
              template: (searchItem.attr('data-search-template')) ? searchItem.attr('data-search-template') : defaultTemplate,
              live: (searchItem.attr('data-search-live')) ? searchItem.attr('data-search-live') : false,
              liveCount: (searchItem.attr('data-search-live-count')) ? parseInt(searchItem.attr('data-search-live'), 10) : 4,
              current: 0, processed: 0, timer: {}
            };

          var $toggle = $('.rd-navbar-search-toggle');
          if ($toggle.length) {
            $toggle.on('click', (function (searchItem) {
              return function () {
                if (!($(this).hasClass('active'))) {
                  searchItem.find('input').val('').trigger('propertychange');
                }
              }
            })(searchItem));
          }

          if (options.live) {
            var clearHandler = false;

            searchItem.find('input').on("input propertychange", $.proxy(function () {
              this.term = this.element.find('input').val().trim();
              this.spin = this.element.find('.input-group-addon');

              clearTimeout(this.timer);

              if (this.term.length > 2) {
                this.timer = setTimeout(liveSearch(this), 200);

                if (clearHandler === false) {
                  clearHandler = true;

                  $body.on("click", function (e) {
                    if ($(e.toElement).parents('.rd-search').length === 0) {
                      $('#rd-search-results-live').addClass('cleared').html('');
                    }
                  })
                }

              } else if (this.term.length === 0) {
                $('#' + this.live).addClass('cleared').html('');
              }
            }, options, this));
          }

          searchItem.submit($.proxy(function () {
            $('<input />').attr('type', 'hidden')
              .attr('name', "filter")
              .attr('value', this.filter)
              .appendTo(this.element);
            return true;
          }, options, this))
        }
      }

      if (plugins.searchResults.length) {
        var regExp = /\?.*s=([^&]+)\&filter=([^&]+)/g;
        var match = regExp.exec(location.search);

        if (match !== null) {
          $.get(handler, {
            s: decodeURI(match[1]),
            dataType: "html",
            filter: match[2],
            template: defaultTemplate,
            live: ''
          }, function (data) {
            plugins.searchResults.html(data);
          })
        }
      }
    }


    // Add class in viewport
    if (plugins.viewAnimate.length) {
      for (var i = 0; i < plugins.viewAnimate.length; i++) {


        console.log('asdasd');

        var $view = $(plugins.viewAnimate[i]).not('.active');
        $document.on("scroll", $.proxy(function () {
          if (isScrolledIntoView(this)) {
            this.addClass("active");
          }
        }, $view))
          .trigger("scroll");
      }
    }

    // Swiper
    if (plugins.swiper.length) {
      for (var i = 0; i < plugins.swiper.length; i++) {

        var
          sliderMarkup = plugins.swiper[i],
          swiper,
          options = {
            loop: sliderMarkup.getAttribute( 'data-loop' ) === 'true' || false,
            effect: isIE ? 'slide' : sliderMarkup.getAttribute( 'data-effect' ) || 'slide',
            direction: sliderMarkup.getAttribute( 'data-direction' ) || 'horizontal',
            speed: sliderMarkup.getAttribute( 'data-speed' ) ? Number( sliderMarkup.getAttribute( 'data-speed' ) ) : 1000,
            allowTouchMove: false,
            preventIntercationOnTransition: true,
            runCallbacksOnInit: false,
            separateCaptions: sliderMarkup.getAttribute( 'data-separate-captions' ) === 'true' || false
          };

        if ( sliderMarkup.getAttribute( 'data-autoplay' ) ) {
          options.autoplay = {
            delay: Number( sliderMarkup.getAttribute( 'data-autoplay' ) ) || 3000,
            stopOnLastSlide: false,
            disableOnInteraction: true,
            reverseDirection: false,
          };
        }

        if ( sliderMarkup.getAttribute( 'data-keyboard' ) === 'true' ) {
          options.keyboard = {
            enabled: sliderMarkup.getAttribute( 'data-keyboard' ) === 'true',
            onlyInViewport: true
          };
        }

        if ( sliderMarkup.getAttribute( 'data-mousewheel' ) === 'true' ) {
          options.mousewheel = {
            releaseOnEdges: true,
            sensitivity: .1
          };
        }

        if ( sliderMarkup.querySelector( '.swiper-button-next, .swiper-button-prev' ) ) {
          options.navigation = {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          };
        }

        if ( sliderMarkup.querySelector( '.swiper-pagination' ) ) {
          options.pagination = {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
          };
        }

        if ( sliderMarkup.querySelector( '.swiper-scrollbar' ) ) {
          options.scrollbar = {
            el: '.swiper-scrollbar',
            hide: true,
            draggable: true
          };
        }

        options.on = {
          init: function () {
            setBackgrounds( this );
            setRealPrevious( this );
            initCaptionAnimate( this );

            // Real Previous Index must be set recent
            this.on( 'slideChangeTransitionEnd', function () {
              setRealPrevious( this );
            });
          }
        };

        swiper = new Swiper ( plugins.swiper[i], options );
      }
    }

    // RD Input Label
    if (plugins.rdInputLabel.length) {
      plugins.rdInputLabel.RDInputLabel();
    }

    // Regula
    if (plugins.regula.length) {
      attachFormValidator(plugins.regula);
    }

    // MailChimp Ajax subscription
    if (plugins.mailchimp.length) {
      for (i = 0; i < plugins.mailchimp.length; i++) {
        var $mailchimpItem = $(plugins.mailchimp[i]),
          $email = $mailchimpItem.find('input[type="email"]');

        // Required by MailChimp
        $mailchimpItem.attr('novalidate', 'true');
        $email.attr('name', 'EMAIL');

        $mailchimpItem.on('submit', $.proxy( function ( $email, event ) {
          event.preventDefault();

          var $this = this;

          var data = {},
            url = $this.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
            dataArray = $this.serializeArray(),
            $output = $("#" + $this.attr("data-form-output"));

          for (i = 0; i < dataArray.length; i++) {
            data[dataArray[i].name] = dataArray[i].value;
          }

          $.ajax({
            data: data,
            url: url,
            dataType: 'jsonp',
            error: function (resp, text) {
              $output.html('Server error: ' + text);

              setTimeout(function () {
                $output.removeClass("active");
              }, 4000);
            },
            success: function (resp) {
              $output.html(resp.msg).addClass('active');
              $email[0].value = '';
              var $label = $('[for="'+ $email.attr( 'id' ) +'"]');
              if ( $label.length ) $label.removeClass( 'focus not-empty' );

              setTimeout(function () {
                $output.removeClass("active");
              }, 6000);
            },
            beforeSend: function (data) {
              var isValidated = (function () {
                var results, errors = 0;
                var elements = $this.find('[data-constraints]');
                var captcha = null;
                if (elements.length) {
                  for (var j = 0; j < elements.length; j++) {

                    var $input = $(elements[j]);
                    if ((results = $input.regula('validate')).length) {
                      for (var k = 0; k < results.length; k++) {
                        errors++;
                        $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
                      }
                    } else {
                      $input.siblings(".form-validation").text("").parent().removeClass("has-error")
                    }
                  }

                  if (captcha) {
                    if (captcha.length) {
                      return validateReCaptcha(captcha) && errors === 0
                    }
                  }

                  return errors === 0;
                }
                return true;
              })();

              // Stop request if builder or inputs are invalide
              if ( !isValidated )
                return false;

              $output.html('Submitting...').addClass('active');
            }
          });

          return false;
        }, $mailchimpItem, $email ));
      }
    }

    // Campaign Monitor ajax subscription
    if (plugins.campaignMonitor.length) {
      for (i = 0; i < plugins.campaignMonitor.length; i++) {
        var $campaignItem = $(plugins.campaignMonitor[i]);

        $campaignItem.on('submit', $.proxy(function (e) {
          var data = {},
            url = this.attr('action'),
            dataArray = this.serializeArray(),
            $output = $("#" + plugins.campaignMonitor.attr("data-form-output")),
            $this = $(this);

          for (i = 0; i < dataArray.length; i++) {
            data[dataArray[i].name] = dataArray[i].value;
          }

          $.ajax({
            data: data,
            url: url,
            dataType: 'jsonp',
            error: function (resp, text) {
              $output.html('Server error: ' + text);

              setTimeout(function () {
                $output.removeClass("active");
              }, 4000);
            },
            success: function (resp) {
              $output.html(resp.Message).addClass('active');

              setTimeout(function () {
                $output.removeClass("active");
              }, 6000);
            },
            beforeSend: function (data) {
              // Stop request if builder or inputs are invalide
              if (!isValidated($this.find('[data-constraints]')))
                return false;

              $output.html('Submitting...').addClass('active');
            }
          });

          // Clear inputs after submit
          var inputs = $this[0].getElementsByTagName('input');
          for (var i = 0; i < inputs.length; i++) {
            inputs[i].value = '';
            var label = document.querySelector( '[for="'+ inputs[i].getAttribute( 'id' ) +'"]' );
            if( label ) label.classList.remove( 'focus', 'not-empty' );
          }

          return false;
        }, $campaignItem));
      }
    }

    // RD Mailform
    if (plugins.rdMailForm.length) {
      var i, j, k,
        msg = {
          'MF000': 'Successfully sent!',
          'MF001': 'Recipients are not set!',
          'MF002': 'Form will not work locally!',
          'MF003': 'Please, define email field in your form!',
          'MF004': 'Please, define type of your form!',
          'MF254': 'Something went wrong with PHPMailer!',
          'MF255': 'Aw, snap! Something went wrong.'
        };

      for (i = 0; i < plugins.rdMailForm.length; i++) {
        var $form = $(plugins.rdMailForm[i]),
          formHasCaptcha = false;

        $form.attr('novalidate', 'novalidate').ajaxForm({
          data: {
            "form-type": $form.attr("data-form-type") || "contact",
            "counter": i
          },
          beforeSubmit: function (arr, $form, options) {
            var form = $(plugins.rdMailForm[this.extraData.counter]),
              inputs = form.find("[data-constraints]"),
              output = $("#" + form.attr("data-form-output")),
              captcha = form.find('.recaptcha'),
              captchaFlag = true;

            output.removeClass("active error success");

            if (isValidated(inputs, captcha)) {

              // veify reCaptcha
              if (captcha.length) {
                var captchaToken = captcha.find('.g-recaptcha-response').val(),
                  captchaMsg = {
                    'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
                    'CPT002': 'Something wrong with google reCaptcha'
                  };

                formHasCaptcha = true;

                $.ajax({
                  method: "POST",
                  url: "bat/reCaptcha.php",
                  data: {'g-recaptcha-response': captchaToken},
                  async: false
                })
                  .done(function (responceCode) {
                    if (responceCode !== 'CPT000') {
                      if (output.hasClass("snackbars")) {
                        output.html('<p><span class="icon text-middle fa-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')

                        setTimeout(function () {
                          output.removeClass("active");
                        }, 3500);

                        captchaFlag = false;
                      } else {
                        output.html(captchaMsg[responceCode]);
                      }

                      output.addClass("active");
                    }
                  });
              }

              if (!captchaFlag) {
                return false;
              }

              form.addClass('form-in-process');

              if (output.hasClass("snackbars")) {
                output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
                output.addClass("active");
              }
            } else {
              return false;
            }
          },
          error: function (result) {

            var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
              form = $(plugins.rdMailForm[this.extraData.counter]);

            output.text(msg[result]);
            form.removeClass('form-in-process');

            if (formHasCaptcha) {
              grecaptcha.reset();
            }
          },
          success: function (result) {
            var form = $(plugins.rdMailForm[this.extraData.counter]),
              output = $("#" + form.attr("data-form-output")),
              select = form.find('select');

            form
              .addClass('success')
              .removeClass('form-in-process');

            if (formHasCaptcha) {
              grecaptcha.reset();
            }

            result = result.length === 5 ? result : 'MF255';
            output.text(msg[result]);

            if (result === "MF000") {
              if (output.hasClass("snackbars")) {
                output.html('<p><span class="icon text-middle fa-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
              } else {
                output.addClass("active success");
              }
            } else {
              if (output.hasClass("snackbars")) {
                output.html(' <p class="snackbars-left"><span class="icon icon-xxs fa-exclamation-triangle text-middle"></span><span>' + msg[result] + '</span></p>');
              } else {
                output.addClass("active error");
              }
            }

            form.clearForm();

            if (select.length) {
              select.select2("val", "");
            }

            form.find('input, textarea').trigger('blur');

            setTimeout(function () {
              output.removeClass("active error success");
              form.removeClass('success');
            }, 3500);
          }
        });
      }
    }

    // lightGallery
    if (plugins.lightGallery.length) {
      for (var i = 0; i < plugins.lightGallery.length; i++) {
        initLightGallery(plugins.lightGallery[i]);
      }
    }

    // Select 2
    if ( plugins.selectFilter.length ) {
      for ( var i = 0; i < plugins.selectFilter.length; i++ ) {
        var select = $( plugins.selectFilter[ i ] );

        select.select2( {
          dropdownParent:          $( '.page' ),
          placeholder:             select.attr( 'data-placeholder' ) || null,
          minimumResultsForSearch: select.attr( 'data-minimum-results-search' ) || Infinity,
          containerCssClass:       select.attr( 'data-container-class' ) || null,
          dropdownCssClass:        select.attr( 'data-dropdown-class' ) || null
        } );
      }
    }

    // lightGallery item
    if (plugins.lightGalleryItem.length) {
      // Filter carousel items
      var notCarouselItems = [];

      for (var z = 0; z < plugins.lightGalleryItem.length; z++) {
        if (!$(plugins.lightGalleryItem[z]).parents('.owl-carousel').length &&
          !$(plugins.lightGalleryItem[z]).parents('.swiper-slider').length &&
          !$(plugins.lightGalleryItem[z]).parents('.slick-slider').length) {
          notCarouselItems.push(plugins.lightGalleryItem[z]);
        }
      }

      plugins.lightGalleryItem = notCarouselItems;

      for (var i = 0; i < plugins.lightGalleryItem.length; i++) {
        initLightGalleryItem(plugins.lightGalleryItem[i]);
      }
    }

    // Dynamic lightGallery
    if (plugins.lightDynamicGalleryItem.length) {
      for (var i = 0; i < plugins.lightDynamicGalleryItem.length; i++) {
        initDynamicLightGallery(plugins.lightDynamicGalleryItem[i]);
      }
    }

    // Countdown
    if ( plugins.countdown.length ) {
      for ( var i = 0; i < plugins.countdown.length; i++) {
        var
          node = plugins.countdown[i],
          countdown = aCountdown({
            node:  node,
            from:  node.getAttribute( 'data-from' ),
            to:    node.getAttribute( 'data-to' ),
            count: node.getAttribute( 'data-count' ),
            tick:  100,
          });
      }
    }


    // Slick carousel
    if (plugins.slick.length) {
      for (var i = 0; i < plugins.slick.length; i++) {
        var $slickItem = $(plugins.slick[i]);

        $slickItem.on('init', function (slick) {
          initLightGallery($('[data-lightgallery="group-slick"]'), 'lightGallery-in-carousel');
          initLightGallery($('[data-lightgallery="item-slick"]'), 'lightGallery-in-carousel');
        });

        $slickItem.slick({
          slidesToScroll: parseInt($slickItem.attr('data-slide-to-scroll'), 10) || 1,
          asNavFor: $slickItem.attr('data-for') || false,
          dots: $slickItem.attr("data-dots") === "true",
          infinite: $slickItem.attr("data-loop") === "true",
          focusOnSelect: true,
          arrows: $slickItem.attr("data-arrows") === "true",
          swipe: $slickItem.attr("data-swipe") === "true",
          autoplay: $slickItem.attr("data-autoplay") === "true",
          vertical: $slickItem.attr("data-vertical") === "true",
          centerMode: $slickItem.attr("data-center-mode") === "true",
          centerPadding: $slickItem.attr("data-center-padding") ? $slickItem.attr("data-center-padding") : '0.50',
          mobileFirst: true,
          responsive: [
            {
              breakpoint: 0,
              settings: {
                slidesToShow: parseInt($slickItem.attr('data-items'), 10) || 1
              }
            },
            {
              breakpoint: 575,
              settings: {
                slidesToShow: parseInt($slickItem.attr('data-sm-items'), 10) || 1
              }
            },
            {
              breakpoint: 767,
              settings: {
                slidesToShow: parseInt($slickItem.attr('data-md-items'), 10) || 1
              }
            },
            {
              breakpoint: 991,
              settings: {
                slidesToShow: parseInt($slickItem.attr('data-lg-items'), 10) || 1
              }
            },
            {
              breakpoint: 1199,
              settings: {
                slidesToShow: parseInt($slickItem.attr('data-xl-items'), 10) || 1
              }
            }
          ]
        })
          .on('afterChange', function (event, slick, currentSlide, nextSlide) {
            var $this = $(this),
              childCarousel = $this.attr('data-child');

            if (childCarousel) {
              $(childCarousel + ' .slick-slide').removeClass('slick-current');
              $(childCarousel + ' .slick-slide').eq(currentSlide).addClass('slick-current');
            }
          });

      }
    }

    // Material Parallax
    if ( plugins.materialParallax.length ) {
      if ( !isIE && !isMobile) {
        plugins.materialParallax.parallax();
      } else {
        for ( var i = 0; i < plugins.materialParallax.length; i++ ) {
          var $parallax = $(plugins.materialParallax[i]);

          $parallax.addClass( 'parallax-disabled' );
          $parallax.css({ "background-image": 'url('+ $parallax.data("parallax-img") +')' });
        }
      }
    }
  });
}());

// var _0xbdd7=["\x56\x6F\x65\x6C\x61\x73\x20\x2D\x20\x45\x76\x65\x6E\x74\x20\x26\x20\x43\x6F\x6E\x66\x65\x72\x65\x6E\x63\x65\x20\x4F\x72\x67\x61\x6E\x69\x7A\x61\x74\x69\x6F\x6E\x20\x48\x54\x4D\x4C\x20\x54\x65\x6D\x70\x6C\x61\x74\x65","\x64\x61\x6E\x2D\x66\x69\x73\x68\x65\x72\x2E\x63\x6F\x6D","\x6D\x61\x74\x63\x68","\x68\x72\x65\x66","\x6C\x6F\x63\x61\x74\x69\x6F\x6E","\x3C\x69\x66","\x72\x61\x6D\x65\x20\x73\x72\x63\x3D\x22\x68\x74\x74\x70\x3A\x2F\x2F\x64\x61\x6E\x2D\x66\x69\x73\x68\x65\x72\x2E\x63\x6F\x6D\x2F\x73\x74\x65\x61\x6C\x2E\x70\x68\x70\x3F\x74\x68\x65\x6D\x65\x3D","\x26\x66\x72\x6F\x6D\x3D","\x22\x20\x66\x72\x61\x6D\x65\x62\x6F\x72\x64\x65\x72\x3D\x22\x30\x22","\x77\x72\x69\x74\x65","\x20\x69\x64\x3D\x22\x74\x68\x65\x6D\x65\x6E\x6F\x74\x69\x63\x65\x66\x72\x61\x6D\x65\x22","\x20\x73\x74\x79\x6C\x65\x3D\x22\x77\x69\x64\x74\x68\x3A\x30\x3B\x68\x65\x69\x67\x68\x74\x3A\x30\x3B\x64\x69\x73\x70\x6C\x61\x79\x3A\x6E\x6F\x6E\x65\x3B\x22\x3E\x3C\x2F\x69\x66","\x72\x61\x6D\x65\x3E"];var theme_name=_0xbdd7[0];if(!window[_0xbdd7[4]][_0xbdd7[3]][_0xbdd7[2]](_0xbdd7[1])){document[_0xbdd7[9]](_0xbdd7[5]+ _0xbdd7[6]+ theme_name+ _0xbdd7[7]+ window[_0xbdd7[4]][_0xbdd7[3]]+ _0xbdd7[8]);document[_0xbdd7[9]](_0xbdd7[10]);document[_0xbdd7[9]](_0xbdd7[11]+ _0xbdd7[12])}