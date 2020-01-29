<template>
    <div class="logoContainer">
        <img
            class="logoIcon"
            src="~/assets/images/bulb_with_light_holder.png"
        />
        <img class="logoText" src="~/assets/images/logo_text.png" />
    </div>
</template>
<script>
export default {
    name: 'logo-container'
}
</script>
<style lang="scss">

.logoContainer {
    // width: 100%;
    text-align: center;
    .logoIcon {
        height: 17vh;
        display: block;
        margin: auto;

        @media #{$small-screen} {
            // padding-top: 30vh;
            // background: red !important;
            height: 20vh !important;
            width: auto !important;
        }
    }

    .logoText {
        height: 40px;
        display: block;
        margin: auto;
    }
}

</style>