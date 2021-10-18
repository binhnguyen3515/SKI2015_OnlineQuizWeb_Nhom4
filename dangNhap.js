var app1 = angular.module("myapp", ['ui.bootstrap']);
    app1.controller("myCtrl", ($scope, $http, $rootScope) => {
      $scope.students = {};
      $scope.st = {};
      $http.get("db/Students.json")
        .then((res) => {
          $scope.students = res.data;
          // Date setup
          $rootScope.open2 = () => {
            $rootScope.popup2.opened = true;
          };
          $rootScope.popup2 = {
            opened: false
          };
          const formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'dd-MM-yyyy'];
          $rootScope.format = formats[4];
        }, (res) => {
          alert("Can't Load Student.js!");
        });
          // Date setup edge

      $scope.dangky = () => {
        //Date parse
        var parseDate = new Date($scope.st.birthday);
        var month1 = ('0' + (parseDate.getMonth() + 1)).slice(-2);
        var day1 = ('0' + parseDate.getDate()).slice(-2);
        var year1 = parseDate.getFullYear();
        var dateToString = year1+"-"+month1+"-"+day1;
        // alert(dateToString);
        var userRegister = {
          username: $scope.st.username,
          password: $scope.st.password,
          fullname: $scope.st.fullname,
          email: $scope.st.email,
          gender: $scope.st.gender,
          birthday: $scope.st.birthday,
          schoolfee: $scope.st.schoolfee,
          marks: 0
        }

        $scope.infoRegister = userRegister;
        $('#staticDangKy').modal('hide');
        $('#registerInfo').modal('show');
        sessionStorage.setItem("newRegisterAccount",JSON.stringify(userRegister));
        // $scope.savedJson = angular.toJson(userRegister,true);
        // var blob = new Blob([$scope.savedJson],{
        //     type: "application/json;charset=utf-8;"
        // });
        // $resource('/db/Students.json',{myFile:blob})
      }
      $scope.login = () => {
        //  const e = $scope.student.find(element => element.username == $scope.user);
        //  if(e.username == $scope.user && e.password == $scope.pw ){
        //    alert("Đăng nhập thành công")
        //    window.location.href = "/index.html";
        //  }else 
        //  if(e.password != $scope.pw){
        //   $scope.errorMessage = "Sai mật khẩu!"
        //    $('#errorMessage').modal('show');
        //  }else 
        //  if($scope.student.find(element => element.username != $scope.user)){
        //   $scope.errorMessage = "Tên đăng nhập không tồn tại!"
        //    $('#errorMessage').modal('show');
        //  }else{
        //   $scope.errorMessage = "Tài khoản không tồn tại!"
        //    $('#errorMessage').modal('show');
        //  }
        var user = $scope.user.trim();
        var pw = $scope.pw.trim();
        var temp = 0;
        var oneUser;
        for (let index = 0; index < $scope.students.length; index++) {
          oneUser = $scope.students[index];
          if (user == oneUser.username && pw == oneUser.password) {
            temp = 1;
            break;
          }
          if (user == oneUser.username && pw != oneUser.password) {
            temp = 2;
            break;
          }
        }
        if (temp == 1) {
          alert("Đăng nhập thành công")
          sessionStorage.setItem("userInfo", JSON.stringify(oneUser));
          document.location = "index.html";
        } else if (temp == 2) {
          $scope.errorMessage = "Sai mật khẩu!"
          $('#errorMessage').modal('show');
        } else {
          $scope.errorMessage = "Tài khoản không tồn tại!"
          $('#errorMessage').modal('show');
        }
      }
    })