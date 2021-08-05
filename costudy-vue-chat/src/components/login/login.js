import auth from "../../auth/auth";

export default {
  name: "login",
  components: {},
  props: [],
  data() {
    return {
      form: {
        userName: '',
        password: '',
      },
    };
  },
  computed: {},
  mounted() {},

  methods: {
    login() {
      auth.login(this.form.userName, this.form.password).then((result)=>{
        console.log(result);
      });
      
    },
  },
};
