import { defineComponent } from "vue";
// import s from "./ItemsList.module.scss";
import svg from "@svg_map";
import { MainLayout } from "@/layouts/MainLayout";
export const ItemsList = defineComponent({
  name: "ItemsList",
  setup(props, context) {
    return () => <div>ItemsList</div>;
  },
});

export const ItemsCreate = defineComponent({
  name: "ItemsList",
  setup(props, context) {
    return () => (
      <MainLayout title="记一笔" icon={svg.back} toggle={() => {}}>
        {{
          default: () => <main>create</main>,
        }}
      </MainLayout>
    );
  },
});
