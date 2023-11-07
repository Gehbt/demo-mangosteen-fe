import { Fragment, defineComponent } from "vue";
export const Bar = defineComponent({
   setup() {
      //   defineRender(()=><Fragment><div>33</div></Fragment>)
       return () => 
           <div>22</div>
   },
});
// defineRender(()=><Fragment><div>22</div></Fragment>)