(function() {

    angular
        .module("app.tabscontrol", [])
        .controller('TabsCtrl', ['$scope', tabsCtrl]);


    function tabsCtrl($scope) {

        $scope.tabs = [{
            title: 'Overview',
            url: 'panels/overview.html'
        }, {
            title: 'Stops',
            url: 'stops.html'
        }, {
            title: 'Lines',
            url: 'lines.html'
        }];

        $scope.currentTab = 'panels/overview.html';

        $scope.onClickTab = function (tab) {
            $scope.currentTab = tab.url;
        }

    }
}());