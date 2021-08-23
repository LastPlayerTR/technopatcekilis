// ==UserScript==
// @name         Technopat Çekiliş
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Technopat Çekiliş
// @author       LastPlayer
// @match        https://www.technopat.net/sosyal/konu/*
// @icon         https://www.google.com/s2/favicons?domain=technopat.net
// @updateURL    https://gist.github.com/LastPlayerTR/3de7331de1c18de7c0a8364aa34b0fb7/raw/6448250e06fe2d7c6605eb0c7ec945cb24c877b3/technopatcekilis.user.js
// @downloadURL  https://gist.github.com/LastPlayerTR/3de7331de1c18de7c0a8364aa34b0fb7/raw/6448250e06fe2d7c6605eb0c7ec945cb24c877b3/technopatcekilis.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// @require https://cdn.jsdelivr.net/npm/sweetalert2@11
// ==/UserScript==


(function () {
    function rand(items) {
        // "|" for a kinda "int div"
        return items[items.length * Math.random() | 0];
    }
    'use strict';
    function parsecomment(){
        let parsedcms = {}
        let list = document.getElementsByClassName("message message--post js-post js-inlineModContainer  ")
        for (let item of list) {
            let qid = item.getAttribute("data-content")
            let msg = item.querySelector(".bbWrapper").innerHTML;
            let msgcount = item.querySelector(".message-userExtras").getElementsByClassName("pairs pairs--justified")[1].querySelector("dd").innerHTML.replace(/\./g, "") * 1
            let username = item.querySelector(".username ").innerHTML
            console.log(msg + " - " + msgcount + " - " + username)
            parsedcms[qid] = {msg : msg , msgcount : msgcount , username : username}

        }
        return parsedcms

    }

    function sonucekrani(){
        let sonliste = {}
        let cekilislistesi = {}
        Swal.fire({
            title: 'Yorumlar toplandı!',
            text: 'Filtreleme Ekranına Aktarılıyorsunuz',
            icon: 'success',
            allowOutsideClick : false,
            timer : 5000
        }).then(result=>{
            Swal.fire({
                title: 'Kullanıcının minimum kaç mesajı olmalı?',
                icon: 'question',
                input: 'range',
                inputLabel: 'Sayı',
                inputAttributes: {
                  min: 0,
                  max: 1000,
                  step: 10
                },
                inputValue: 0
            }).then((result) => {
                if (result.isConfirmed) {
                    let dataz = GM_getValue('datas',{})
                    dataz = JSON.parse(dataz)
                    for (var datak of Object.keys(dataz)){
                        let data = dataz[datak]
                        
                        if(data.msgcount >= result.value && (data.msg.includes("Katılıyorum.") || data.msg.includes("Katıldım.") || data.msg.includes("Katiliyorum.") || data.msg.includes("Katildim.")) ){
                            sonliste[datak] = data
                            cekilislistesi[data.username] = true
                        }
                    }
                    let winner = rand(Object.keys(cekilislistesi))
                    Swal.fire(
                        'Kazanan:',
                        winner,
                        'success'
                    ).then(res=>{
                        for(const datak of Object.keys(sonliste)){
                            let data = sonliste[datak]
                            if(data.username == winner){
                                window.location.replace(GM_getValue('mainurl',"https://example.com")+datak)
                            }

                        }
                        GM_setValue('ongoing' , false)
                        GM_setValue('mainurl' , undefined)
                        GM_setValue('datas' , undefined)
                        
                    })

                    
                }

    

            })
        })
        //console.log(JSON.parse(GM_getValue('datas',{})))
    }
    if(GM_getValue("ongoing", false) == true){
        Swal.fire({
            title: 'Yorumlar Sayılıyor!',
            text : "Sistem verileri düzenliyor lütfen bekleyin!",
            allowOutsideClick : false,
            didOpen: () => {
              Swal.showLoading()
              
            }
        })

        let data = parsecomment()

        let dataz = GM_getValue('datas',{})
        dataz = JSON.parse(dataz)

        Object.keys(data).forEach(e => {
            dataz[e] = data[e]
        });

        GM_setValue('datas',JSON.stringify(dataz))
        let btn =document.querySelector(".pageNav-jump.pageNav-jump--next")
        if(btn != undefined){
            window.location.replace(btn.getAttribute("href"))
        }else{
            sonucekrani()
            GM_setValue('ongoing' , false)
        }

    }
    const zaaa = document.createElement('button');
    zaaa.id = 'Tamamla';
    zaaa.innerText = "Çekilişi Başlat";
    zaaa.style.cursor = 'pointer';
    zaaa.style.position = 'fixed';
    zaaa.style.bottom = '10px';
    zaaa.style.right = '100px';
    zaaa.style.color = 'black';

    zaaa.style.zIndex = 10001; // css, lock to right bottom, get over everything in the page.
    zaaa.onclick = async function () {
        GM_setValue('ongoing' , false)
        GM_setValue('datas' , undefined)


        GM_setValue('mainurl' , window.location.href)
        let datam = parsecomment()

        GM_setValue('datas',JSON.stringify(datam))
        Swal.fire({
            title: 'Yorumlar Sayılıyor!',
            text : "Sistem verileri düzenliyor lütfen bekleyin!",
            allowOutsideClick : false,
            didOpen: () => {
              Swal.showLoading()
            }
        })
        let btn =document.querySelector(".pageNav-jump.pageNav-jump--next")
        if(btn != undefined){
            GM_setValue('ongoing' , true)
            window.location.replace(btn.getAttribute("href"))
        }else{
            GM_setValue('ongoing' , false)
            sonucekrani()
        }

    };


    if(GM_getValue("ongoing", false) == false){
        document.body.append(zaaa); // append the button directly to the body.
    }


    const resetgiveaway = document.createElement('button');
    resetgiveaway.id = 'Tamamla';
    resetgiveaway.innerText = "Verileri Sıfırla";
    resetgiveaway.style.cursor = 'pointer';
    resetgiveaway.style.position = 'fixed';
    resetgiveaway.style.bottom = '10px';
    resetgiveaway.style.right = '250px';
    resetgiveaway.style.color = 'black';

    resetgiveaway.style.zIndex = 10001; // css, lock to right bottom, get over everything in the page.
    resetgiveaway.onclick = async function () {
        GM_setValue('ongoing' , false)
        GM_setValue('datas' , undefined)
        GM_setValue('mainurl' , undefined)
    };



    document.body.append(resetgiveaway); // append the button directly to the body.




    // Your code here...
})();
