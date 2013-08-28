$(function(){
    $("inputformdev#toggle").click(function(){
        $('.cbox').prop('checked', $(this).prop('checked'));
        $("p").hide();
    });
});

$(function(){
    $(".surname").click(function(){
         $(this).select();
    });
});


$(function(){
    $('.surname, .email, passwd').live('mouseup', function() {
        alert('aa');
        $(this).select();
    });
});


$("input").focus(function() {
    $("p").fadeToggle("fast", "linear");
});
$("input").focusout(function() {
    $("p").fadeToggle("fast", "linear");
});
