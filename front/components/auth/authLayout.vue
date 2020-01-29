<template>
    <div id="authPage">
        <v-layout class="mainGrid" row>
            <left-container></left-container>
            <slot></slot>
            <right-container></right-container>
        </v-layout>
        <auth-footer></auth-footer>
    </div>
</template>
<script>
import leftContainer from '~/components/auth/leftContainer'
import rightContainer from '~/components/auth/rightContainer'
import authFooter from '~/components/auth/authFooter'

export default {
    components: { leftContainer, rightContainer, authFooter }    
}
</script>
<style lang="scss" scoped>
#authPage {
    height: 100vh;
    overflow: hidden;
    background: white;
    // border: 1px solid red;
    z-index: 1000;

    .backBtn {
        color: $primary-color;
        position: fixed;
        top: 0;
        left: 0;
        margin: 5px 3px;
        z-index: 100;

        i {
        font-size: 16px;
        }
    }

    .mainGrid {
        margin: 0px;
        height: 100vh;
    }
}
</style>