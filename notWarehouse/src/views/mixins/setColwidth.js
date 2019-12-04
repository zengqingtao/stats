//操作列列宽
export default {
    methods: {
        setColWidth(colWidth) {
            var clientWidth = document.body.clientWidth;
            if (clientWidth <= 480) {
                this.rowHandle["width"] = colWidth;
            }
        }
    }
}