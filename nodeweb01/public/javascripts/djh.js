$(function(){
    $("inputformdev#toggle").click(function(){
        $('.cbox').prop('checked', $(this).prop('checked'));
        $("p").hide();
    });
});

$(function(){
    $(".surname,.givingname, .email, .passwd").click(function(){
         $(this).select();
    });
});


$(function(){
    $(".gender").change(function(){
        if($(this).is(":checked")){
            $(".RadioSelected:not(:checked)").removeClass("RadioSelected");
            $(this).next("label").addClass("RadioSelected");
        }
    });
});
