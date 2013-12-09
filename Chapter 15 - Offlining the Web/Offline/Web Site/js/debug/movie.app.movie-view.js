﻿/// <reference path="movie.app.js" />
/// <reference path="movie.app.api.js" />

(function (window, undefined) {

    "use strict";

    movieApp.fn.movie = {
        Items: {
            reviewPanel: ".movie-review-panel",
            detailPanel: ".movie-details-panel",
            castPanel: ".movie-cast-panel",
            showtimesPanel: ".movie-showtimes-panel",
            descPanel: ".movie-description-panel"
        }
    };

    var prevWidth = window.innerWidth;

    movieApp.fn.movieView = {

        onload: function (params) {

            if (!params || !params.id) {
                this.showError("No Movie Id Requested");
            }

            var that = this,
                mv = this.movieView;

            prevWidth = window.innerWidth;

            this.loadMovieDetails(params.id, function (data) {

                if (!data) {
                    return;
                }

                mv.renderMovieDetails.call(that, data);

            });

        },

        unload: function () {

            delete this.resizeEvents["manageMovieView"];

        },

        renderMovieDetails : function (data) {

            if (data) {

                var that = this,
                    mv = that.movieView;

                that.mergeData(".movie-details-panel", "movieDetailsPosterTemplate", data);
                that.mergeData(".movie-description", "movieDetailsDescriptionTemplate", data);
                that.mergeData(".cast-name-list", "movieDetailsCastTemplate", data);
                that.mergeData(".movie-showtime-list", "MovieShowtimeTemplate",
                                that.mergeInFakeShowtimes(data));

                that.setupPanorama(".panorama-container", { maxWidth: 610 });
                that.setMainTitle(data.title);

                mv.bindPanelTitles.call(that);
                
                that.resizeEvents["manageMovieView"] = mv.manageMovieView;

                var reviewSubmit = document.getElementById("reviewSubmit");

                document.reviewForm.onsubmit = function (e) {

                    e.preventDefault();

                    if (e.srcElement) {
                        var i = 0,
                            data = {},
                            inputs = e.srcElement.querySelectorAll("input, textarea");

                        for (; i < inputs.length; i++) {
                            data[inputs[i].name] = inputs[i].value;
                            console.info(inputs[i].name + " " + inputs[i].value);
                        }


                    }

                    return false;

                };

                requestAnimationFrame(function () {
                    mv.manageMovieView.call(that);
                });

            }

        },

        bindPanelTitles : function () {

            var showTimes = document.querySelector(".movie-showtime-list"),
                castNames = document.querySelector(".cast-name-list"),
                movieDesc = document.querySelector(".movie-description"),
                showTimesTitle = document.querySelector(".movie-showtimes-panel > .panel-title"),
                castNamesTitle = document.querySelector(".movie-cast-panel > .panel-title"),
                movieDescTitle = document.querySelector(".movie-description-panel > .panel-title"),
                showReview = document.getElementById("showReview"),
                selectors = this.movie.Items;

            $.show(movieDesc);

            deeptissue(movieDescTitle).tap(function (e) {

                var width = window.innerWidth;

                if (width > 600 && width < 820) {

                    $.hide(showTimes);
                    $.hide(showReview);
                    $.hide(castNames);
                    $.show(movieDesc);
                    
                    $.removeClass(showTimesTitle, "selected");
                    $.removeClass(castNamesTitle, "selected");
                    $.addClass(movieDescTitle, "selected");

                }

            });

            deeptissue(castNamesTitle).tap(function (e) {

                var width = window.innerWidth;

                if (width > 600 && width < 820) {

                    $.hide(showTimes);
                    $.hide(showReview);
                    $.show(castNames);
                    $.hide(movieDesc);

                    castNames.style.position = "relative";
                    castNames.style.left = "-130px";

                    $.removeClass(showTimesTitle, "selected");
                    $.addClass(castNamesTitle, "selected");
                    $.removeClass(movieDescTitle, "selected");

                }

            });

            deeptissue(showTimesTitle).tap(function (e) {

                var width = window.innerWidth;

                if (width > 600 && width < 820) {

                    $.show(showTimes);
                    $.show(showReview);
                    $.hide(castNames);
                    $.hide(movieDesc);

                    showTimes.style.position = "relative";
                    showTimes.style.left = "-260px";

                    showReview.style.position = "relative";
                    showReview.style.left = "-200px";
                    showReview.style.top = "30px";

                    $.addClass(showTimesTitle, "selected");
                    $.removeClass(castNamesTitle, "selected");
                    $.removeClass(movieDescTitle, "selected");

                }

            });

            deeptissue(showReview).tap(function (e) {

                $.show(document.querySelector(selectors.reviewPanel));
                $.hide(document.querySelector(selectors.detailPanel));
                $.hide(document.querySelector(selectors.castPanel));
                $.hide(document.querySelector(selectors.showtimesPanel));
                $.hide(document.querySelector(selectors.descPanel));

                document.getElementById("ReviewerName").focus();

            });

            deeptissue(document.getElementById("reviewCancel")).tap(function (e) {

                $.hide(document.querySelector(selectors.reviewPanel));
                $.show(document.querySelector(selectors.detailPanel));
                $.show(document.querySelector(selectors.castPanel));
                $.show(document.querySelector(selectors.showtimesPanel));
                $.show(document.querySelector(selectors.descPanel));

            });

        },

        manageMovieView : function () {

            var width = window.innerWidth;

            //move from mini-tablet view
            if (width < 610 && width > 820 && prevWidth > 610 && prevWidth < 820) {

                var showTimes = document.querySelector(".movie-showtime-list"),
                    castNames = document.querySelector(".cast-name-list");

                showTimes.style.position = "";
                showTimes.style.left = "";

                showReview.style.position = "";
                showReview.style.left = "";
                showReview.style.top = "";

            }

            //need a routine to reset the order of panels since they may have been swiped


            var poster = document.querySelector(".full-movie-poster");

            if (width > 1024) {
                
                poster.src = poster.src
                                    .replace("pro", "ori")
                                    .replace("det", "ori");

            } else {

                poster.src = poster.src
                                    .replace("pro", "det")
                                    .replace("ori", "det");

            }

        },

        clearInlineRelativePostition : function (nodes) {

            if (!nodes.legth) {
                nodes = [nodes];
            }

            for (var i = 0; i < nodes.length; i++) {

                nodes[i].style.position = "";
                nodes[i].style.left = "";

            }

        }

    };


}(window));