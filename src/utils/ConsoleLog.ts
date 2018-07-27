export default {
    init() {
        let doc = document;

        doc.addEventListener('DOMContentLoaded', event => {
            doc.addEventListener('touchstart', e => {
                window.console.log('touchstart', e.target);
            });
            doc.addEventListener('touchmove', e => {
                window.console.log('touchmove', e.target);
            });
            doc.addEventListener('touchend', e => {
                window.console.log('touchend', e.target);
            });
            // doc.addEventListener('click', e => {
            //     window.console.log('click', e.target);
            // });
        });
    }
}