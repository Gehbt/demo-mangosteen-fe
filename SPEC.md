# vueTsx
## 编码规范
### ref默认值

推荐使用

```tsx
const div = ref<HTMLDivElement>();
```

不推荐使用
```tsx
const div = ref<HTMLDivElement | null>(null);
```
