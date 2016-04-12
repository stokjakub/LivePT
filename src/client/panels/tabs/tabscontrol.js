(function() {

    angular
        .module("app.viewControl", [])
        .controller('viewController', ['$scope', tabsCtrl]);


    function tabsCtrl($scope) {

        $scope.tabs = [{
            title: 'Overview',
            url: 'panels/tabs/overview.html'
        }, {
            title: 'Stops',
            url: 'panels/tabs/stops.html'
        }, {
            title: 'Lines',
            url: 'panels/tabs/lines.html'
        },{
            title: 'Interruptions',
            url: 'panels/tabs/interruptions.html'
        },{
            title: 'Arrivals',
            url: ' panels/tabs/arrivals.html'
        },{
            title: 'Charts',
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