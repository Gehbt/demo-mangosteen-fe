import { PropType, Ref, defineComponent, reactive, ref, toRaw } from "vue";
import s from "./TagsEdit.module.scss";
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "./Button";
import {
  type RulesType,
  validate,
  InvalidateError,
  errorFree,
} from "@/composables/validate";
import { Form, FormItem } from "./Form";
import { showConfirmDialog, showDialog } from "vant";
import { httpClient } from "@/shared";
import { AxiosError } from "axios";

export const TagsEdit = defineComponent({
  name: "TagsEdit",
  setup(props, context) {
    window.blur();
    const kind = useRouteQuery<TagKindType>("kind");
    const router = useRouter();
    if (!kind.value) {
      showDialog({ message: "参数不存在" });
      router.back();
      return;
    }
    console.log("kind :>> ", kind.value);
    const tag_id = useRouteParams<string>("id");
    const tag_id_number = computed(() => Number.parseInt(tag_id.value));
    if (Number.isNaN(tag_id_number.value)) {
      return () => <div>tag id="{tag_id.value}"不存在</div>;
    }
    // Maybe FIXME::reduce upcast
    const formData = ref({
      kind: kind.value,
      name: "",
      sign: "",
    });
    const onDelete = async ({ withItem }: { withItem: boolean }) => {
      // useless
      await httpClient.delete(
        `/tags${tag_id_number.value}`,
        {
          // TODO: mock
          with_item: withItem.toString(),
        },
        {
          _mock: "tagDelete",
          _loading: true,
        }
      );
    };
    return () => (
      <>
        <MainLayout
          title="编辑标签"
          icon={svgs.back}
          // todo: reduce router.replace
          toggle={() => router.replace("/items/create")}
        >
          <TagsForm id={tag_id_number.value} formData={formData.value}>
            <Button
              class={[s.formItem, s.btn]}
              clan="button"
              onClick={() => {
                // TODO:
                console.log("Form summit :>> ");
              }}
            >
              保存
            </Button>
          </TagsForm>
          <div class={s.actions}>
            <Button
              level="danger"
              class={[s.btn, s.removeTags]}
              // TODO:
              onClick={async () => {
                showConfirmDialog({ message: "是否删除?" }).then(() => {
                  onDelete({ withItem: false });
                  router.back();
                });
              }}
            >
              删除标签
            </Button>
            <Button
              level="danger"
              class={[s.btn, s.removeAll]}
              // TODO:
              onClick={async () => {
                showConfirmDialog({ message: "是否删除?" }).then(() => {
                  onDelete({ withItem: true });
                  router.back();
                });
              }}
            >
              删除标签和记账
            </Button>
          </div>
        </MainLayout>
      </>
    );
  },
});
export const TagsCreate = defineComponent({
  name: "TagsCreate",
  setup(props, context) {
    const router = useRouter();
    const kind = useRouteQuery<TagKindType>("kind");
    if (!kind.value) {
      showDialog({ message: "参数不存在" });
      router.back();
      return;
    }

    const formData = ref({
      kind: kind.value,
      name: "",
      sign: "",
    });
    return () => (
      <MainLayout
        title="新建标签"
        icon={svgs.back}
        toggle={() => router.replace("/items/create")}
      >
        <TagsForm formData={formData.value}>
          <Button
            clan="button"
            class={[s.formItem, s.btn]}
            onClick={() => {
              // TODO:
              console.log("Form summit :>> ");
              // refForm.value?.submit();
            }}
          >
            确定
          </Button>
        </TagsForm>
      </MainLayout>
    );
  },
});
export const TagsForm = defineComponent({
  name: "TagForm",
  props: {
    id: number(),
    formData: object<{
      kind: TagKindType;
      name: string;
      sign: string;
    }>().isRequired,
  },
  setup(props, context) {
    const router = useRouter();
    const kind = useRouteQuery<TagKindType>("kind");
    // todo: 向上传递
    const formData = useVModel(props, "formData", context.emit);
    const errData: Ref<InvalidateError<typeof formData.value>> = ref({}); // : { name: string; msg: string }[];
    const onSubmit = async (e: Event) => {
      const rules: RulesType<typeof formData.value> = [
        {
          clan: "required",
          key: "name",
          msg: "标签名必填",
          required: true,
        },
        {
          clan: "required",
          key: "sign",
          msg: "标签必填",
          required: true,
        },
        {
          clan: "pattern",
          key: "name",
          msg: "标签名太长",
          pattern: /^.{20,100}$/,
        },
        {
          clan: "pattern",
          key: "name",
          msg: "标签名太短",
          pattern: /^.{1,3}$/,
        },
      ];
      errData.value = validate(formData.value, rules);
      e.preventDefault();
      if (!errorFree(errData.value)) {
        console.log("errData.value :>> ", toRaw(errData.value));
        return;
      } else if (props.id) {
        const response = await httpClient
          .patch(`/tags/${props.id}`, formData.value, {
            params: { id: props.id },
            _mock: "tagEdit",
          })
          .catch((err: AxiosError<OnAxiosError>) => {
            if (err.response?.status === 422) {
              showDialog({
                message: "错误: " + err.response.data.error_message,
              });
              return;
            }
            throw "TagEdit:" + err.cause;
          });
        console.log("response :>> ", response);
        router.back();
      } else {
        const response = await httpClient
          .post("/tags", formData.value, {
            _mock: "tagCreate",
          })
          .catch((err: AxiosError<OnAxiosError>) => {
            if (err.response?.status === 422) {
              showDialog({
                message: "错误: " + err.response.data.error_message,
              });
              return;
            }
            throw "TagCreate:" + err.cause;
          });
        console.log("response :>> ", response);
        router.back();
      }
    };
    onMounted(async () => {
      console.log("props.id :>> ", props.id);
      // warn: props.id从1开始(后改的)
      if (!Number.isSafeInteger(props.id)) {
        return;
      }
      const response = await httpClient.get<Resource<TagType>>(
        `/tags/${props.id}?kind=${kind.value}`,
        {
          id: props.id,
        },
        {
          _mock: "tagQuery",
        }
      );
      console.log("response.data :>> ", response.data);
      formData.value.sign = response.data.resource.sign;
      formData.value.name = response.data.resource.name;
    });
    return () => (
      <Form class={s.form} onSubmit={onSubmit}>
        <FormItem
          label="标签名 (3~20个字)"
          modelValue={formData.value.name}
          errData={errData.value.name?.[0] ?? ""}
          onUpdate:modelValue={(itemName: string) => {
            console.log("itemName :>> ", itemName);
            formData.value.name = itemName;
          }}
          onUpdate:errData={() => {
            errData.value.name = undefined;
          }}
          clan="input"
        ></FormItem>
        <FormItem
          label="标签符号:"
          clan="emoji"
          modelValue={formData.value.sign}
          errData={errData.value.sign?.[0] ?? ""}
          onUpdate:modelValue={(emoji: string) => {
            console.log("emoji :>> ", emoji);
            formData.value.sign = emoji;
          }}
          onUpdate:errData={() => {
            errData.value.sign = undefined;
          }}
        ></FormItem>
        <div>
          <p class={s.tips}>记账时,长按标签即可进行编辑</p>
          <div class={s.formItem_value} onClick={onSubmit}>
            {context.slots.default?.()}
          </div>
        </div>
      </Form>
    );
  },
});
