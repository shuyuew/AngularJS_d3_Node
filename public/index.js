var app = angular.module('myApp',[]);

app.controller('contrl',function($scope,$http,$rootScope){

		$http.get('/projects').then(function(response){
			$scope.arr = response.data;
		});	

		$http.get('/projectsdata').then(function(response){
			$rootScope.obj = response.data;
			console.log($rootScope.obj);
		});	

		$scope.emailSubscribe = function(){

			$scope.newSubs={
				name:$scope.name,
				receiver:$scope.receiver,
				cc:$scope.CC,
				bcc:$scope.BCC,
				date:$scope.date
			};
			console.log($scope.newSubs);

			$http.post('/subscribe',{newSubs:$scope.newSubs}).then(function(){

				console.log('new subscribes send to server!');
				console.log($scope.newSubs);
				$scope.name='';
				$scope.receiver='';
				$scope.CC='';
				$scope.BCC='';
				$scope.date='';

			});
		};
});