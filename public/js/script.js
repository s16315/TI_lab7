/* jshint browser: true, devel: true, unused: true, globalstrict: true */
/* global $: false */


'use strict';

var goRoot = function(){
      $('h1').removeClass('clickable').click(null);
      $('nav').removeClass('small');
      $('form').css('display', 'none');
      $('section h2').css('display', 'none');
      $('section ul').remove();
};

function getShowGenre(genre){
   return function(){
         $.getJSON('/genre/'+ genre, function(data, status){
            if(status == 'success'){
               $('nav').addClass('small');
               $('h1').addClass('clickable').click(goRoot);
               $('form').css('display', 'block');
               $('section ul').remove();
               var ul=$('<ul></ul>');
               $.each(data, function(index, value){
                  var li=$('<li></li>').append(
                     $('<span></span>').addClass('author').text(value[1] + ':'),
                     ' ',                          
                     $('<span></span>').addClass('title').text(value[0])
                  );
                  ul.append(li);
               });
               $('section h2').css('display', 'block').text(genre).after(ul);
            }
            else alert(status);
         });
   };
}

var postBook=function(){
   var titleInput=$('input', this).eq(0);
   var authorInput=$('input', this).eq(1);
   var newTitle=titleInput.val();
   var newAuthor=authorInput.val();
   alert('New title: \t\t'+newTitle+'\nNew author: \t'+newAuthor);
   titleInput.val('');
   authorInput.val('');
   return false;
};

var setup = function() {
   $('form').submit(postBook);
   $.getJSON('/genres', function(data, status){
      if(status == 'success'){
         $.each(data, function(index, value){
            var li = $('<li></li>').text(value).addClass('clickable').click(getShowGenre(value));
            $('nav ul').append(li);
         });
      }
      else alert(status);
   });
};
   
$(document).ready(setup);
