import Vue from "vue";
// import "element-ui/lib/theme-chalk/index.css";
import D2Crud from "@d2-projects/d2-crud";
Vue.use(D2Crud);
import ELEMENT from "element-ui";
import {
    Pagination,
    Dialog,
    Autocomplete,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Menu,
    Submenu,
    MenuItem,
    MenuItemGroup,
    Input,
    InputNumber,
    Radio,
    RadioGroup,
    RadioButton,
    Checkbox,
    CheckboxButton,
    CheckboxGroup,
    Switch,
    Select,
    Option,
    OptionGroup,
    Button,
    ButtonGroup,
    Table,
    TableColumn,
    DatePicker,
    TimeSelect,
    TimePicker,
    Popover,
    Tooltip,
    Breadcrumb,
    BreadcrumbItem,
    Form,
    FormItem,
    Tabs,
    TabPane,
    Tag,
    Tree,
    Alert,
    Slider,
    Icon,
    Row,
    Col,
    Upload,
    Progress,
    Badge,
    Card,
    Rate,
    Steps,
    Step,
    Carousel,
    CarouselItem,
    Collapse,
    CollapseItem,
    Cascader,
    ColorPicker,
    Transfer,
    Container,
    Header,
    Aside,
    Main,
    Footer,
    Loading,
    MessageBox,
    Message,
    Notification
} from "element-ui";

if (process.env.NODE_ENV === "development") {
    require("element-ui/lib/theme-chalk/index.css");
    Select.props.clearable.default=true
    Input.props.clearable.default=true
    Cascader.props.clearable.default=true
    // DatePicker.props.clearable.default=true

    Vue.use(ELEMENT, { size: "medium" });

    Vue.use(Pagination);
    Vue.use(Dialog);
    Vue.use(Autocomplete);
    Vue.use(Dropdown);
    Vue.use(DropdownMenu);
    Vue.use(DropdownItem);
    Vue.use(Menu);
    Vue.use(Submenu);
    Vue.use(MenuItem);
    Vue.use(MenuItemGroup);
    Vue.use(Input);
    Vue.use(InputNumber);
    Vue.use(Radio);
    Vue.use(RadioGroup);
    Vue.use(RadioButton);
    Vue.use(Checkbox);
    Vue.use(CheckboxButton);
    Vue.use(CheckboxGroup);
    Vue.use(Switch);
    Vue.use(Select);
    Vue.use(Option);
    Vue.use(OptionGroup);
    Vue.use(Button);
    Vue.use(ButtonGroup);
    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(DatePicker);
    Vue.use(TimeSelect);
    Vue.use(TimePicker);
    Vue.use(Popover);
    Vue.use(Tooltip);
    Vue.use(Breadcrumb);
    Vue.use(BreadcrumbItem);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Tabs);
    Vue.use(TabPane);
    Vue.use(Tag);
    Vue.use(Tree);
    Vue.use(Alert);
    Vue.use(Slider);
    Vue.use(Icon);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Upload);
    Vue.use(Progress);
    Vue.use(Badge);
    Vue.use(Card);
    Vue.use(Rate);
    Vue.use(Steps);
    Vue.use(Step);
    Vue.use(Carousel);
    Vue.use(CarouselItem);
    Vue.use(Collapse);
    Vue.use(CollapseItem);
    Vue.use(Cascader);
    Vue.use(ColorPicker);
    Vue.use(Transfer);
    Vue.use(Container);
    Vue.use(Header);
    Vue.use(Aside);
    Vue.use(Main);
    Vue.use(Footer);

    Vue.use(Loading.directive);

    Vue.prototype.$loading = Loading.service;
    Vue.prototype.$msgbox = MessageBox;
    Vue.prototype.$alert = MessageBox.alert;
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$prompt = MessageBox.prompt;
    Vue.prototype.$notify = Notification;
    Vue.prototype.$message = Message;
}
let loadingList = [];
Vue.directive("krLoading", {
    update: function(el, value) {
        if (value.value) {
            let index = loadingList.findIndex(value => el == value.target);
            if (index == -1) {
                let one = Loading.service({
                    target: el,
                    text: "数据计算中......"
                });
                loadingList.push(one);
            }
        } else {
            let index = loadingList.findIndex(value => el == value.target);
            if (index != -1 && loadingList[index].visible) {
                loadingList[index].close();
                loadingList.splice(index, 1);
            }
        }
    }
});
