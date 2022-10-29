<template>
    <div ref="jldiv" id="jldiv" class="pa-0 ma-0" height="100%">
        <job-file-list v-if="listType == 'joblist'" align="center" class="pa-0 ma-0" :style="getCalGridH"></job-file-list>
        <filament-file-list v-if="listType == 'filamentlist'" align="center" class="pa-0 ma-0" :style="getCalGridH"></filament-file-list>
        <macro-file-list v-if="listType == 'macrolist'" align="center" class="pa-0 ma-0" :style="getCalGridH"></macro-file-list>
        <event-list v-if="listType == 'eventlist'" align="center" class="pa-0 ma-0" :style="getCalGridH"></event-list>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        props: {
            listType: String
        },
        data() {
            return {
                calcGridHeight: 0
            }        
	    },
        computed:{
            ...mapState({
			darkTheme: state => state.settings.darkTheme
		}),
            getCalGridH(){
                return `overflow: auto; max-height: ${this.calcGridHeight}px; background-color: ${this.getDWCPanelBGColor()} !important`
            }
        },
        methods:{
            getDWCPanelBGColor(){
                //Sets the background colour of the std DWC panels
                //Done this way to allow for future user defined background color functionality
                if(this.darkTheme){
                    return "#515151";
                }else{
                    return "#f5f5f5";
                }
            },
        },
        mounted() {
            //this redraws the file list to fit the grid item size
            this.calcGridHeight = this.$refs.jldiv.parentElement.parentElement.clientHeight;
            const resizeObs = new ResizeObserver(entries => this.calcGridHeight = (entries[0].target.clientHeight));
            resizeObs.observe(this.$refs.jldiv.parentElement.parentElement);
        }

    }
</script>