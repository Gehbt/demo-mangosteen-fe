import { defineComponent, ref } from "vue";
// import s from "./ItemsList.module.scss";
import svg from "@svg_map";
import { MainLayout } from "@/layouts/MainLayout";
import { Tab, Tabs } from "./Tabs";
import { InputPad } from "./InputPad";
import s from "./ItemsList.module.scss";
export const ItemsList = defineComponent({
  name: "ItemsList",
  setup(props, context) {
    return () => <div>ItemsList</div>;
  },
});
export type ItemsName = "支出" | "收入";
export const ItemsCreate = defineComponent({
  name: "ItemsCreate",
  setup(props, context) {
    const selectedTab = ref<"支出" | "收入">("支出");
    const updateSelected = (tabName: ItemsName) =>
      (selectedTab.value = tabName);
    const ss = true;
    const router = useRouter();
    return () => (
      <MainLayout
        title="记一笔"
        icon={svg.back}
        toggle={() => {
          console.log("back :>> /start");
          router.replace("/start");
        }}
      >
        {{
          default: () => (
            // <Tabs
            //   selected={selectedTab.value}
            //   onUpdateSelected={updateSelected}
            // >
            <>
              <Tabs v-model:selected={selectedTab.value}>
                <Tab name="支出">111</Tab>
                <Tab name="收入">222</Tab>
              </Tabs>
              <div class={s.inputPad_wrapper}>
                <InputPad></InputPad>
              </div>
            </>
          ),
        }}
      </MainLayout>
    );
  },
});
