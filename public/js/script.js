/* jshint browser: true, devel: true, unused: true, globalstrict: true */
/* global $: false */


'use strict';

var goRoot = function(){
      $('h1').removeClass('clickable').click(null);
      $('nav').removeClass('small');
      $('form').css('display', 'none');
      $('section h2').css('display', 'none');
      $('section ul').remove();
      $('table').empty();
};
function showBookForm() {
   $('#forms').empty().append(
       $('  <section><h2 style=\'display:none\'></h2><form  style=\'display:none\'>' +
           '<p><span>Tytuł: </span><input required=\'required\' /></p>' +
           '<p><span>Autor: </span><input required=\'required\' /></p>' +
           '<p><input type=\'submit\' value="Dodaj książkę" /></p></form></section>'
       )
   );
   $('form').submit(postBook);
}
function getShowGenre(genre){
   return function(){
         $.getJSON('/genre/'+ genre, function(data, status){
            if(status === 'success'){
               $('nav').addClass('small');
               $('h1').addClass('clickable').click(setup);
               $('form').css('display', 'block');
               $('section table').remove();
               var tb = $('<table></table>').attr('id', 'tableOfBooks');
               tb.append($('<thead><tr><th>Autor</th><th>Tytuł</th></th></thead>'));
               var ul=$('<ul></ul>');
               $.each(data, function(index, value){
                  tb.append($('<tr></tr>').append(
                      $('<td></td>').addClass('author').text(value[1]),
                      $('<td></td>').addClass('title').text(value[0])
                  ));
               });
               $('section h2').css('display', 'block').text(genre).after(tb);
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
   $.post('/genre/' + $('section h2').text(), {'author': newAuthor, 'title': newTitle}, function (res) {
      switch (res) {
         case "bookAdded":
            $('#loginForm').empty();
            $('#tableOfBooks').append(
                $('<tr></tr>').append(
                    $('<td></td>').addClass('author').text(newAuthor),
                    $('<td></td>').addClass('title').text(newTitle)
                )
            );
            $('#statement').text("Dodano książkę").fadeOut(2000, function(){this.remove();});
            break;
         case "notLoggedIn":
            $('#statement').text("Żeby dodać książkę trzeba się zalogować!").fadeOut(4000, function(){
               this.remove();
            });
            showLoginForm();
            break;
         default:
            $('#statement').text("Wystąpił problem z dodaniem książki").fadeOut(2000, function(){this.remove();});
      }
   });
   titleInput.val('');
   authorInput.val('');
   return false;
};
function showLoginForm() {
   $('nav').css('display', 'none');
   $('#forms').empty().append(
       $('  <section><h2 style=\'display:none\'></h2><form  style=\'display:none\'>' +
           '<p><span>Użytkownik: </span><input required=\'required\' id="username" /></p>' +
           '<p><span>Hasło: </span><input required=\'required\' id="password" type="password"/></p>' +
           '<p><input type=\'submit\' value="Zaloguj się" /></p></form></section>'
       )
   );
   $('form').css('display', 'block');
   $('form').submit(login);
}
var unLog = function () {
   $.post('/login', {'username': "", 'password': ""}, function (res) {
      if(res ==='notLoggedIn'){
         $('#unLogButton').css('display', 'none');
      }
   });

};
var login=function(){
   $.post('/login', {'username': $('#username').val(), 'password': $('#password').val()}, function (res) {
      switch (res) {
         case "logged":
            $('#statement').text("Udało się zalogować").fadeOut(2000, function(){this.remove();});
            showBookForm();
            $.get('/lastgenre', function (data, status) {
               if(status === 'success'){
                  $('nav').css('display', 'block');
                  $('form').css('display', 'block');
                  $('section h2').css('display', 'block').text(data);
                  getShowGenre(data)();
                  $('#unLogButton').css('display', 'block');
               }
               else goRoot();
            });
            break;
         case "notLoggedIn":
            $('#statement').text("Wystąpił problem z logowaniem!").fadeOut(4000, function(){
               this.remove();
            });
            break;
         default:
            $('#statement').text("Wystąpił problem z dodaniem książki").fadeOut(2000, function(){this.remove();});
      }
   });
   $('#username').val('');
   $('#password').val('');
   return false;
};
var setup = function() {
   showBookForm();
   $('#unLogButtonDiv').append(
       $('<button id="unLogButton">Wyloguj się</button>').css('display', 'none').click(unLog)
   );
      $.getJSON('/genres', function(data, status){
      if(status === 'success'){
         $('nav ul').empty();
         $.each(data, function(index, value){
            var li = $('<li></li>').text(value).addClass('clickable').click(getShowGenre(value));
            $('nav ul').append(li);
         });
      }
      else alert(status);
   });
};
   
$(document).ready(setup);
