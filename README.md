# Kanban View Control (Canvas App Edition)

| ![Kanban Control](https://github.com/novalogica/pcf-kanban-control/blob/main/KanbanViewControl/screenshots/kanban-case-example.png) |
|:--:|
| *Figure 1: Kanban view displaying records in canvas app.* |

> ✅ **Forked and maintained by [KGBRecord](https://github.com/kgbrecord)**  
> 🔄 This fork modifies the original [Novalogica PCF Kanban Control](https://github.com/novalogica/pcf-kanban-control) to support **Power Canvas Apps only** instead of model-driven apps.

---

## 📌 Features
- Dynamic Kanban board layout for Power Canvas App.
- Drag-and-drop support.
- Customizable **step-based columns** with ordering.
- Supports dynamic content rendering using `collection`.
- Inline record update and toast notifications.
- Drag-and-drop **result** is passed to the `dragResult` output property for Power Fx handling.

---

## ⚙️ Canvas App Configuration

This version of the control is designed to be used **inside a PowerApps Canvas App** and relies on certain input properties to build the Kanban board.

### Required Input Properties

| Property               | Type     | Description |
|------------------------|----------|-------------|
| `collection`           | `string` (JSON) | A **stringified array** of objects representing your records. Each object may include any number of custom fields. |
| `bpfStepsOptionsOrder` | `string` (JSON) | A **stringified array** in the format `[{"id": any, "order": number, "color": string}]` to define the display order and color of columns. |
| `stepField`            | `string` | The field in each record used to determine its Kanban column (e.g., `"stageName"`). |

#### Example values:

```js
collection: '[{"id":"1","title":"Task 1","stageName":"To Do"}, {"id":"2","title":"Task 2","stageName":"Done"}]'

bpfStepsOptionsOrder: '[{"id":"To Do","order":0,"color":"#f4cccc"},{"id":"In Progress","order":1,"color":"#ffe599"},{"id":"Done","order":2,"color":"#d9ead3"}]'

stepField: 'stageName'
```

---

## 🧠 Logic Summary

- The control parses the `collection` to generate cards.
- It uses the `stepField` to group and assign cards into columns.
- If `bpfStepsOptionsOrder` is provided, columns are ordered accordingly by `order`.
- If `bpfStepsOptionsOrder` is **missing or invalid**, columns are sorted **alphabetically** by their `id`.

---

## 🖱️ Card Behavior

- Each card dynamically displays all fields from its object.
- Dragging a card to another column updates its `stepField` value and triggers a **toast notification**.
- On drop, a string will be set into the `dragResult` output, allowing Power Fx to act accordingly.

#### Example Output on Card Drop:
```txt
UPDATE#<recordId>#<newStepId>
```

You can use Power Fx to parse this result:

```powerfx
Set(parts, Split(KanbanViewControl1.dragResult, "#"));
If(
    First(parts).Value = "UPDATE",
    Patch(DataSource, LookUp(DataSource, ID = Index(parts, 2).Value), { stageName: Index(parts, 3).Value })
)
```

---

## 📦 Deployment Instructions (For PCF Devs)

To build and deploy the component:

```sh
pac auth create --url https://your-environment.crm.dynamics.com
pac auth select --index <index>
pac pcf push -pp <your-publisher-prefix>
```

---

## 💡 Notes

- This version is meant **exclusively** for **Canvas App** embedding. Do **not** use in Model-driven apps.
- You must handle card data updates and UI refresh **manually** via Power Fx (e.g., `Set`, `Patch`, `Refresh`, etc.).
- `dragResult` is a key binding point to react to card movement.

---

## 📢 Contributions

Forked and maintained by [KGBRecord](https://github.com/kgbrecord).  
If you encounter issues or have enhancements, feel free to open issues or PRs.

---

## 📜 License

This fork inherits the **MIT License** from the original project. See `LICENSE` file for more.
