(function() {

    angular
        .module("app.viewControl", [])
        .controller('viewController', ['$scope', '$rootScope', tabsCtrl]);


    function tabsCtrl($rootScope,$scope) {

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
            title: 'HELP',
            url: ' panels/tabs/help.html'
        }];

        $scope.currentTab = 'panels/tabs/overview.html';

        $scope.onClickTab = function (tab) {

            $scope.currentTab = tab.url;

            if (tab.title == 'HOME'){
              //$rootScope.map.locateUser();
            }
        };
        $rootScope.stopTabActive = function(){
          $scope.currentTab = 'panels/tabs/stops.html'
        };
        $scope.isActiveTab = function(tabUrl) {
            return tabUrl == $scope.currentTab;
        };



    }
}());
