$(document).ready(()=>{
    $('.delete-article').on('click',(e)=>{
        $target= $(e.target);
        const id = $target.attr('data-id');
        console.log(id)
        $.ajax({
            type:'DELETE',
            url: '/articles/'+id,
            success:function (response) {
                alert("Deleting Article");
                window.location.href ='/';

            },
            error: function (err) {
                console.log(err);

            }
        })
    })
})
$(document).ready(()=>{
    $('.add-comment').on('click',(e)=>{
        $target = $(e.target);
        // console.log(e);
        const id = $target.attr('article-id');
        let comment = $('#comment-textinput').val();
        console.log(id,comment);
        $.ajax({
            type: "POST",
            url:'/articles/comment/'+id,
            data:JSON.stringify({
                comment:comment,
                number: 3423243
            }),
            // dataType: "json",
            contentType: 'application/json',
            success:()=>{
                alert('comment add')
            },
            error:(err)=>{
                console.log('Error occurred')
                console.log(err);
            }

        })

    })
})