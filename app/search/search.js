'use strict';

(function () {

    var SearchCtrl = function ($scope, PaginQueue, datacontext) {

        $scope.country = "Canada";

        $scope.sidebars = {
            companies: [],
            jobtypes: []
        };
        $scope.pbar="60";

        $scope.next = function () {
            PaginQueue.pagin_next();
        }
        $scope.prev = function () {
            PaginQueue.pagin_prev();
        }
        $scope.validateSearch = function () {
            var role = $scope.role;
            var local = $scope.local;
            if (role.trim().length == 0 && local.trim().length == 0) {
                $("#err").modal('show'); // TODO: Create Angular Modal Service to popup dialogs with custom messages.
            } else {
                window.location.replace('http://' + location.host + "/search?keyword=" + encodeURIComponent(role) + "&local=" + encodeURIComponent(local));
            }
        };

        $scope.fetchResults = function (num) {
            // TODO: Add logic to utilize data
            if (!num) {
                num = 1;
            }


            datacontext.getJob($scope.role, $scope.local, num).then(function (response) {


                var data = response.data;
                angular.forEach(data, function (v, k) {
                    if (isNaN(k) != true) {
                        addToJobList(v["JobDetailURL"], v["CompanyName"], v["JobDate"],
                            v["JobLocation"], v["JobDetails"]);
                    }
                    if (k === "sideBar") {
                        $scope.initSideBar(v);
                    }

                });
            }, function (error) {
                    //TODO: Should display a model on error
            });

        };

        $scope.initSideBar = function (v) {

            angular.forEach(v.Companies, function (sidebarValue, sidebarKey) {
                $scope.sidebars.companies.push({
                    compurl: "/cxf/search/company:" + sidebarKey + ",location:", //TODO: Add location here...
                    compname: sidebarKey,
                    compcount: sidebarValue
                });

            });
            angular.forEach(v.JobType, function (sidebarTypeValue, sidebarTypeKey) {
                $scope.sidebars.jobtypes.push({
                    jtypeurl: "/cxf/search/company:" + sidebarTypeKey + ",location:", //TODO: Add location here.
                    jtypename: sidebarTypeKey,
                    jtypecount: sidebarTypeValue
                });

            });

        }


        $scope.generateMap = function () {
            // TODO: Add logic to generate map...
        };
        $scope.map = {center: {latitude: 43, longitude: -79}, zoom: 8};

        var addMarker = function (latitude, longitude, title) {
            return {
                latitude: latitude,
                longitude: longitude,
                title: title
            }
        };
        $scope.markers = [{
            latitude: 43.7075863,
            longitude: -79.3957828,
            title: "Red Hat"
        }];


        $scope.joblist = [];

        var addToJobList = function (u, t, p, l, s) {
            $scope.joblist.push({
                url: u,
                title: t,
                postedon: p,
                locations: l,
                summary: s
            });
        };

        var addToSidebar = function (cu, cn, cc, jtu, jtn, jtc) {
            $scope.sidebars.push({
                compurl: cu,
                compname: cn,
                compcount: cc,
                jtypeurl: jtu,
                jtypename: jtn,
                jtypecount: jtc
            });
        };

    };
    angular.module('myApp.search', ['ngRoute', 'myApp.service.PaginQueue', 'myApp.service.datacontext','ui.bootstrap']) //'uiGmapgoogle-maps'])
        .config(['$routeProvider', //'uiGmapGoogleMapApiProvider',
            function ($routeProvider){ // uiGmapGoogleMapApiProvider) {
            $routeProvider.when('/search', {
                templateUrl: 'search/search.html',
                controller: 'SearchCtrl'
            });
            //uiGmapGoogleMapApiProvider.configure({
            //    china: true
            //});
        }]).controller('SearchCtrl', SearchCtrl)
        .directive('searchmorebutton', function () {
            return {
                templateUrl: "templates/SearchMoreButton.html",
                restrict: "E",
                scope: {
                    company: "=",
                    loc: "="
                },
                replace: true
            };

        }).directive('jobposts', function () {
            return {
                templateUrl: "templates/jobpost.html",
                restrict: "E",
                replace: true
            }
        })
        .directive('socialmedia', function () {
            return {
                templateUrl: "templates/socialmediabuttons.html",
                restrict: "E",
                scope: {
                    company: "=",
                    loc: "="
                },
                replace: true
            };

        }).directive('sidebar', function () {
            return {
                templateUrl: "templates/sidebar.html",
                restrict: "E",
                replace: true
            };

        });
    ;

}())
