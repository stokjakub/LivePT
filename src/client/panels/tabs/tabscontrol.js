(function() {

    angular
        .module("app.viewControl", [])
        .controller('viewController', ['$scope', tabsCtrl]);


    function tabsCtrl($scope) {

        $scope.tabs = [{
            title: 'HOME',
            url: 'panels/tabs/overview.html'
        }, {
            title: 'STATIONS',
            url: 'panels/tabs/stops.html'
        }, {
            title: 'LINES',
            url: 'panels/tabs/lines.html'
        },{
            title: 'STATUS UPDATES',
            url: 'panels/tabs/interruptions.html'
        },{
            title: 'EXTRAS',
            url: ' panels/tabs/arrivals.html'
        },{
            title: 'HELP',
            url: ' panels/tabs/charts.html'
        }];

        $scope.currentTab = 'panels/tabs/overview.html';

        $scope.onClickTab = function (tab) {
            $scope.currentTab = tab.url;
        };

        $scope.isActiveTab = function(tabUrl) {
            return tabUrl == $scope.currentTab;
        }

    }
}());
