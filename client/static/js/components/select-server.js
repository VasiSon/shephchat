Vue.component('select-server', {
  	template: `
        <div class="col-4 offset-4 select-server">
      	  	<form class="form-inline">
                <div class="form-group mx-sm-3 mb-2">
                    <input type="ip" class="form-control" placeholder="IP-адрес сервера" v-model="ip">
                </div>
                <button class="btn btn-warning mb-2" v-on:click.prevent="connect()" v-bind:class="{disabled: !ipValid}">
                    <i class="fa fa-server" v-if="!connecting"></i>
                    <i class="fa fa-spinner fa-spin" v-if="connecting"></i>
                </button>
            </form>
        </div>
  	`,
  	data: function(){
  	  	return {
  	  		  ip: "",
              connecting: false,    //Для вращения колесика подключения
  	  	}
  	},
    computed: {
        //Проверка ввода
        ipValid: function(){
            //Регулярное выражение
            var pattern = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;
            return this.ip.match(pattern);
        }
    },
  	methods: {
  	     connect: function(){
             if(this.ipValid){
                 //Порождаем событие connect
                 this.$emit('connect', this.ip);
                 this.connecting = true;
             }
  		 }
    }
});
