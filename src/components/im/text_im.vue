<template>
    <div class="container"
        id="apply">
        <div class="text_im_top">

        </div>
        <div class="text_im_body">
            <p>-+-------------</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>-+-------------</p>
        </div>
        <div class="text_im_footer">
            <input @focus="focus_input"
                type="text">
        </div>
    </div>
</template>
<script>
export default {
    name: "text_im",
    data () {
        return {
        };
    },
    created () {
        var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;

    },
    components: {
    },
    methods: {
        focus_input () {
            setTimeout(function () {
                document.body.scrollTop = document.body.scrollHeight;
            }, 300);
        },
    },
}
</script>
<style  scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
}
.text_im_top {
    width: 100%;
    height: 60px;
    background-color: #333;
}
.text_im_body {
    width: 100%;
    min-height: 80%;
    overflow: auto;
}
.text_im_footer {
    width: 100%;
    height: 60px;
    background-color: #eeeeee;
}
.text_im_footer input {
    background-color: #ffffff;
}
.focusState {
    position: absolute;
}
</style>