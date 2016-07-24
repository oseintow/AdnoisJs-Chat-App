
$(function() {
    var personSocket = io("http://" + "192.168.1.2:3700" + "/persons");
    var selectedPerson;
    var currentuser;

    $( "#enterName" ).click(function() {
        var username = $("#username");
        if(username.val() == "") return;

        localStorage.setItem("username", username.val());
        personSocket.emit('new user', username.val(), function(callback){
            currentuser = username.val();
            console.log(callback);
        });
    });

    personSocket.on('new user', function(data){
        $("#personList").append("<li><a class='userlist' style='cursor: pointer' data-value="+ data.user +">" + data.user + "</a></li>");
    });

    $("ul").on("click",'li a.userlist',function(){
        selectedPerson = $(this).attr('data-value');
        $("#userSelected").text(selectedPerson);
    });

    $("#sendPersonMessage").on("click",function(e){
        e.preventDefault();
        var msg = $("#chatPersonMessage");
        if(msg.val() == "") return;

        $("#chatPersonMessages").append("<li>" + msg.val() + "</li>");
        personSocket.emit("new message", { receiver: selectedPerson, message: msg.val() });
    });

    personSocket.on("get message",function(data){
       $("#chatPersonMessages").append("<li>" + data + "</li>");
    });

    personSocket.emit("get users",function(callback){
        var username = localStorage.getItem("username");
        $("#username").val(username);
        callback.users.forEach(function (user) {
            if(username != user) {
                $("#personList").append("<li><a class='userlist' style='cursor: pointer' data-value=" + user + ">" + user + "</a></li>");
            }
            })
    });


});





