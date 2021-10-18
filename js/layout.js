var app = angular.module("myapp", ['ngRoute', 'ui.bootstrap', 'angular.css.injector']);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/trangChu", {
            templateUrl: "includePages/trangChu.html?" + Math.random(),
            controller: "trangChuCtrl"
        })
        .when("/gioiThieu", {
            templateUrl: "includePages/gioiThieu.html?" + Math.random(),
            controller: "gioiThieuCtrl"
        })
        .when("/lienHe", {
            templateUrl: "includePages/lienHe.html?" + Math.random(),
            controller: "lienHeCtrl"
        })
        .when("/gopY", {
            templateUrl: "includePages/gopY.html?" + Math.random(),
            controller: "gopYCtrl"
        })
        .when("/hoiDap", {
            templateUrl: "includePages/hoiDap.html?" + Math.random(),
            controller: "hoiDapCtrl"
        })
        .when("/danhSachSinhVien", {
            templateUrl: "includePages/danhSachSinhVien.html?" + Math.random(),
            controller: "danhSachCtrl"
        })
        .when("/quiz/:id/:name/:logo", {
            templateUrl: "includePages/quiz.html",
            controller: "quizCtrl"
        })
        .otherwise({
            redirectTo: "/trangChu",
            controller: "trangChuCtrl"
        })
});
//quiz controller
app.controller("quizCtrl", function ($http, $routeParams, quizFactory, cssInjector) {
    $http.get("db/Quizs/" + $routeParams.id + '.js').then(function (res) {
        quizFactory.questions = res.data;
    });
    // cssInjector.add("css/poly_quiz.css");
});
app.directive('quiz', function (quizFactory, $routeParams,$rootScope,$interval) {
    return {
        restrict: 'AE',
        scope: {},
        templateUrl: 'includePages/quiz1.html',
        link: function (scope, elem, attrs) {
            scope.sjName = $routeParams.name;
            scope.sjLogo = $routeParams.logo;

            scope.start = function () {
                var userInfo = sessionStorage.getItem("userInfo");
                if(userInfo == null){
                    $rootScope.errorMessage2 = "Vui lòng đăng nhập để thực hiện bài test!";
                    $('#errorMessage2').modal('show');
                }else{
                    quizFactory.getQuestions().then(()=>{
                        scope.id = 0;
                        scope.inProgress = true;
                        scope.answerMode = false;
                        scope.getQuestion();
                        scope.startTime();
                    })
                } 
                    // quizFactory.getQuestions().then(()=>{
                    //     scope.id = 0;
                    //     scope.inProgress = true;
                    //     scope.answerMode = false;
                    //     scope.getQuestion();
                    //     scope.startTime();
                    // })
            };
            scope.reset = function () {
                scope.inProgress = false;
            }
            //Variables use for calculate score
            var currentChoose = {};
            var questionToUpdate = [];
            var rightAnswers = [];
            var rightAnswer = {};
            const map = new Map();
            const map2 = new Map();

            scope.getQuestion = function () {
                var quiz = quizFactory.getQuestion(scope.id);
                if (quiz) {
                    scope.question = quiz.Text;
                    scope.options = quiz.Answers;
                    scope.answer = quiz.AnswerId;
                    scope.currentPage = 1;
                    scope.totalItems = quiz.length;
                    
                }
            }
            scope.cssColor = function (a, b) {
                var flag = "None";
                var temp = false;
                for (let i = 0; i < questionToUpdate.length; i++) {
                    if (a == questionToUpdate[i].as) {
                        temp = true;
                        break;
                    } 
                }
                if(temp){
                    flag="activeAnswer";
                }
                return flag;
            }
            scope.checkAnswer = function () {
                if (!$('input[name=answer]:checked').length) return;
                var ans = $('input[name=answer]:checked').val();
                
                //Cập nhật câu trả lời đã chọn vào questionTodate
                currentChoose = {
                    qs: scope.question,
                    as: ans
                };

                map.set(scope.question, ans);
                // console.log(map);
                questionToUpdate = Array.from(map, ([qs, as]) => ({
                    qs,
                    as
                }));
                rightAnswer = {
                    qs: scope.question,
                    as: JSON.stringify(scope.answer)
                };

                map2.set(scope.question, scope.answer);
                // console.log(map2);
                rightAnswers = Array.from(map2, ([qs, as]) => ({
                    qs,
                    as
                }));
            }
            scope.prevQuestion = function () {
                scope.id--;
                scope.cssColor();
                scope.getQuestion();
                if (scope.id < 0) {
                    scope.id = 0;
                }
            }

            scope.nextQuestion = function () {
                // console.log(scope.id);
                scope.id++
                scope.cssColor();
                scope.getQuestion();
                if (scope.id >9) {
                    scope.id = 9;
                }
            }

            //timer
            function getms(duration) {
                var minutes = parseInt(duration / 60, 10);
                var seconds = parseInt(duration % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                return {
                    minutes: minutes,
                    seconds: seconds
                }
            };
            var time;
            scope.timer = {};
            scope.timer.value = 120 * 1;
            scope.startTime = function () {
                function countdown() {
                    var ms = getms(scope.timer.value);
                    scope.timer.minutes = ms.minutes;
                    scope.timer.seconds = ms.seconds;
                    if (--scope.timer.value < 0) {
                        scope.timer.value = 0;
                        $rootScope.showResult();
                        scope.stopTime();
                    }
                };
                countdown();
                time = $interval(function () {
                    countdown();
                }, 1000);
            }
            scope.stopTime = () => {
                $interval.cancel(time);
            };

            //Xem đáp án     
            $rootScope.openAnswer = function(){
                $('input[name=answer]').addClass('avoidClick');
                $('#finishTest').modal('hide');
                scope.cssColor = function (a, b) {
                    flag = "None";
                    if (a == b) {
                        flag = "trueAnswer";
                    } 
                    if(a != b){
                        flag = "wrongAnswer"
                    }    
                    //
                    var temp = false;
                    for (let i = 0; i < questionToUpdate.length; i++) {
                        if (a == questionToUpdate[i].as) {
                            temp = true;
                            break;
                        } 
                    }
                    if(temp){
                        flag="activeAnswer";
                    }
                    //
                    scope.answerMode = true;
                    return flag;
                }
                
                
            }
            scope.finish = function () {
                $('#warningModal').modal('show');
            }
            scope.count1 = 0
            $rootScope.showResult = function (){
                scope.stopTime();
                scope.answerMode = true;
                $('#warningModal').modal('hide');
                var count = 0
                if (rightAnswers == null) {
                    count = 0;
                    return;
                }
                for (let i = 0; i < rightAnswers.length; i++) {
                    if (rightAnswers[i].as == questionToUpdate[i].as && rightAnswers[i].qs == questionToUpdate[i].qs) {
                        count += 1;
                    }
                }
                $('#finishTest').modal('show');
                if(count < 5){
                    $rootScope.message = "Bạn không đủ điều kiện qua môn!";
                    $rootScope.testResult=()=>"bg-danger";
                    $rootScope.iconResult=()=>"far fa-times-circle";
                }else{
                    $rootScope.message = "Bạn đã đủ điều kiện qua môn!";
                    $rootScope.testResult=()=>"bg-success";
                    $rootScope.iconResult=()=>"far fa-check-circle";
                }
                $rootScope.now = new Date();
                $rootScope.sjName = $routeParams.name;
                $rootScope.sjLogo = $routeParams.logo;
                $rootScope.sjID = $routeParams.id;
                $rootScope.score = count;
                scope.count1 = count;
                console.log(count);
                count = 0;
            }
            $rootScope.thoatTest = function(){
                $('#finishTest').modal('hide');
                window.location.href="index.html";
            }
            scope.reset();
        }
    }
})
//Trộn random phần tử một array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
app.service('quizFactory', function ($http, $routeParams) {
    return {
        getQuestions:function(){
            return $http.get('db/Quizs/' + $routeParams.id + '.js').then((res) => questions = shuffleArray(res.data), () => alert("can't load json file"));
        },
        getQuestion: function (id) {
            // var random = questions[Math.floor(Math.random()*questions.length)];
            var count = questions.length;
            if (count > 10);
            count = 10;
            if (id < count) {
                console.log("id:"+id);
                return questions[id];
            } else {
                return false;
            }

        }

    }
})
//sidebar controller
app.controller("sidebarCtrl", ($scope, $http, $rootScope) => {
    $http.get("db/Subjects.js")
        .then((response) => {
            $scope.subjectsSideBar = response.data;
            var userInfo = sessionStorage.getItem("userInfo");
            var user = JSON.parse(userInfo);
            $scope.accountStatus = false;
            if (userInfo != null) {
                $rootScope.userLogin = user;
                $scope.accountStatus = true;
            } else {
                $scope.accountStatus = false;
            }
        })
    $scope.logOut = () => {
        $scope.userInfo = null;
        $scope.accountStatus = false;
        sessionStorage.removeItem("userInfo");
        window.location.href="index.html";
    }
    $scope.sidebarEffect = () => {
        let sidebar = document.querySelector(".sidebar");
        let closeBtn = document.querySelector("#btn");
        let searchBtn = document.querySelector(".bx-search");
        closeBtn.addEventListener("click", () => {
            sidebar.classList.toggle("open");
            menuBtnChange(); //calling the function(optional)

        });

        searchBtn.addEventListener("click", () => { // Sidebar open when you click on the search iocn
            sidebar.classList.toggle("open");
            menuBtnChange(); //calling the function(optional)
        });
        // following are the code to change sidebar button(optional)
        function menuBtnChange() {
            if (sidebar.classList.contains("open")) {
                closeBtn.classList.replace("bx-menu", "bx-menu-alt-right"); //replacing the iocns class
                // $('#collapseOne').show();
            } else {
                closeBtn.classList.replace("bx-menu-alt-right", "bx-menu"); //replacing the iocns class
                // $('#collapseOne').toggleClass('d-none');
            }
        }
        $(document).ready(function () {
            $('#btn').click();
            //đổi màu cho submenu on sidebar khi focus
            $('.nav-item').on("click", function () {
                $('.nav-item').removeClass('active');
                $(this).addClass('active');
            });
        })
    }

    // Date setup
    $rootScope.open2 = () => {
        $rootScope.popup2.opened = true;
    };
    $rootScope.popup2 = {
        opened: false
    };
    const formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'dd-MM-yyyy'];
    $rootScope.format = formats[4];

    //Đăng ký tài khoản
    $rootScope.st = {};
    $rootScope.dangky = () => {
        //Date parse
        var parseDate = new Date($rootScope.st.birthday);
        var month1 = ('0' + (parseDate.getMonth() + 1)).slice(-2);
        var day1 = ('0' + parseDate.getDate()).slice(-2);
        var year1 = parseDate.getFullYear();
        var dateToString = year1 + "-" + month1 + "-" + day1;
        // alert(dateToString);
        var userRegister = {
            username: $rootScope.st.username,
            password: $rootScope.st.password,
            fullname: $rootScope.st.fullname,
            email: $rootScope.st.email,
            gender: $rootScope.st.gender,
            birthday: $rootScope.st.birthday,
            schoolfee: $rootScope.st.schoolfee,
            marks: 0
        }

        $rootScope.infoRegister = userRegister;
        $('#staticDangKy').modal('hide');
        $('#registerInfo').modal('show');

        //Insert into danhSach
        $rootScope.students.push(angular.copy(userRegister));
    }

    //Lưu thông tin edit
    $rootScope.saveEdit = () => {
        $rootScope.students[$rootScope.index] = angular.copy($rootScope.editSt);
        const getBirthDate = $rootScope.students[$rootScope.index].birthday;
        month = ('0' + (getBirthDate.getMonth() + 1)).slice(-2);
        day = ('0' + getBirthDate.getDate()).slice(-2);
        year = getBirthDate.getFullYear();
        $rootScope.students[$rootScope.index].birthday = year + "-" + month + "-" + day;
        $('#editStudent').modal('hide');
        $scope.refresh();
    }

    $rootScope.acceptDelete = () => {
        console.log("accept running")
        console.log($rootScope.deleteInfoIndex);
        if ($rootScope.index == -1) {

        } else {
            $rootScope.students.splice($rootScope.index, 1)
            $('#deleteStudent').modal('hide');
            $scope.refresh();
        }
    }

    $scope.refresh = () => {
        $rootScope.editSt = {}
        $rootScope.index = -1;
    }

    //Đổi mật khẩu
    $rootScope.doiMatKhau = () => {
        var userInfo = sessionStorage.getItem("userInfo");
        var user = JSON.parse(userInfo);
        user.password = $rootScope.st.newPass;

        for (let i = 0; i < $rootScope.students.length; i++) {
            if (user.username == $rootScope.students[i].username) {
                $rootScope.students[i] = angular.copy(user);
                $('#staticDoiMatKhau').modal('hide');
                break;
            }
        }
    }
})
//trang chủ
app.controller("trangChuCtrl", function ($scope, $http, cssInjector, $rootScope) {
    $http.get("db/Subjects.js")
        .then(function successCallBack(response) {
            $scope.subjects = response.data;
            $scope.currentPage = 1;
            $scope.itemsPerPage = 8;
            $scope.totalPages = Math.ceil(response.data.length / $scope.itemsPerPage);
            $scope.totalItems = response.data.length;
            cssInjector.removeAll();
            $scope.sideBarSupport;

        }, function errorCallBack() {
            alert("Load subjects.js không thành công, kiểm tra lại server!");
        })
})



// Giới thiệu
app.controller("gioiThieuCtrl", function ($scope, cssInjector) {
    cssInjector.removeAll();
})
// Liên lạc
app.controller("lienHeCtrl", function ($scope, cssInjector) {
    cssInjector.removeAll();
    cssInjector.add("css/poly_lienHe.css");
})
// Góp ý
app.controller("gopYCtrl", function ($scope, cssInjector) {
    cssInjector.removeAll();
})
// Hỏi đáp
app.controller("hoiDapCtrl", function ($scope, cssInjector) {
    cssInjector.removeAll();
    cssInjector.add("css/poly_hoiDap.css");
})
// Danh sách sinh viên
app.controller("danhSachCtrl", function ($scope, cssInjector, $http, $rootScope) {
    $http.get("db/Students.json")
        .then(function successCallBack(response) {
            $rootScope.students = response.data;
            cssInjector.removeAll();
            angular.element(document).ready(function () {
                dTable = $('#myTable')
                dTable.DataTable({
                    "pageLength": 8,
                    "lengthMenu": [
                        [8, 16, 24, -1],
                        [8, 16, 24, "All"]
                    ],
                    "language": {
                        "paginate": {
                            'previous': '<i class="fas fa-backward"></i>',
                            'next': '<i class="fas fa-forward"></i>'
                        }
                    }
                });
            });
            //Thêm người dùng đăng ký vào table
            var newRegisterAccount = sessionStorage.getItem("newRegisterAccount");
            if (newRegisterAccount != null) {
                var jsonParse = JSON.parse(newRegisterAccount);
                $rootScope.students.push(angular.copy(jsonParse));
                // for (let i = 0; i < newRegisterAccount.length; i++) {
                //     var jsonParse = JSON.parse(newRegisterAccount[i]);
                //     $rootScope.students.push(angular.copy(jsonParse));  
                // }
                sessionStorage.removeItem("newRegisterAccount");
            }
            // Date setup
            $rootScope.open2 = () => {
                $rootScope.popup2.opened = true;
            };
            $rootScope.popup2 = {
                opened: false
            };
            const formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'dd-MM-yyyy'];
            $rootScope.format = formats[4];

            $rootScope.editUser = (getIndex) => {
                $('tr').on('click', '#submitEdit', function () {
                    $('tr').removeClass('activeEdit');
                    $(this).parent().parent().addClass('activeEdit');
                })
                $rootScope.index = getIndex;
                $rootScope.editSt = angular.copy($rootScope.students[getIndex]);
                $rootScope.editSt.birthday = new Date($rootScope.students[getIndex].birthday);
            }

            $rootScope.deleteUser = (getIndex) => {
                $rootScope.index = getIndex;
            }
        }, function errorCallBack(response) {
            alert("Load subjects.js không thành công, kiểm tra lại server!");
        })
})
// app.controller("modalCtrl", ($scope, $rootScope) => {

// })
app.run(function ($rootScope, $http) {
    // $rootScope.$on('$includeContentLoaded',function(){
    //   $http.get("js/script.js")
    //   $http.get("js/script.js")
    // })
    $rootScope.$on('$routeChangeStart', function () {
        $rootScope.loading = true;
    });
    $rootScope.$on('$routeChangeSuccess', function () {
        $rootScope.loading = false;
    });
    $rootScope.$on('$routeChangeError', function () {
        $rootScope.loading = false;
        alert("Lỗi, không tải được template");
    });
})