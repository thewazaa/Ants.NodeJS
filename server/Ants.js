class Ants {
    constructor(id) {
        this.total = 0;
        this.id = id;
        this.canvas = document.getElementById(this.id);
        this.ctx = this.canvas.getContext('2d');
    }

    draw() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', "http://localhost:8080/info/img" + this.total, true);
        xhr.responseType = 'json';
        xhr.onload = function () {
            if (xhr.status === 200) {
                var imageObj = new Image();
                imageObj.src = xhr.responseText;
                ctx.drawImage(imageObj, 0, 0);
            }
        }
    }
}