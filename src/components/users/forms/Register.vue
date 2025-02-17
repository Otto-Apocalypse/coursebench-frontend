<template>
  <v-card
    :loading="formStatus.loading"
    style="overflow-y: hidden"
    :class="
      $vuetify.breakpoint.name === 'xs' ? '' : 'd-flex justify-space-between flex-column'
    "
  >
    <v-card-title
      class="pt-6 pt-sm-11 px-6 px-sm-11 pb-0 d-flex justify-space-between"
    >
      <div>
        <img 
          class='small-icon' 
          :src="$vuetify.theme.dark ? logoDark : logoLight" 
          alt=''
        />
        <!-- <v-img src="@/assets/logo.svg" width="50%"></v-img> -->
      </div>
      <div>
        <v-btn
          icon
          style="transform: translate(0, -1px)"
          @click="closeDialog('register')"
          v-if="$vuetify.breakpoint.name === 'xs'"
        >
          <v-icon>{{ statics.icons.mdiWindowClose }}</v-icon>
        </v-btn>
      </div>
    </v-card-title>
    <v-window v-model="formStatus.windowStep" touchless
      style="height: 100%"
    >   
      <v-window-item :value="0" style="height: 100%">
        <v-card-text
          class="px-6 px-sm-11 py-0 d-flex justify-sm-space-between flex-column"
          style="height: 100%; min-height: 262px;"
        >
          <div>
            <div class="font-weight-bold text-h5 pt-2">注册</div>
            <v-form v-model="formStatus.emailFormValid" @submit="$event.preventDefault(), clickNextStep()">
              <v-card-text class="pa-0">
                <v-text-field
                  v-model="userData.email"
                  :rules="[formRules.required, formRules.email]"
                  placeholder="请输入上科大邮箱"
                  ref="emailTextField"
                ></v-text-field>
              </v-card-text>
            </v-form>
            <div class="text-body-2 py-1">
              <span>已有账号？</span>
              <span
                class="inline-link"
                @click="closeDialog('register'), openDialog('login')"
                >前往登录</span
              >
            </div>
          </div>
          <div
            class="px-0 pt-0 pb-6 pb-sm-11 pt-8 pt-sm-0 d-flex justify-end"
          >
            <v-btn
              @click="clickNextStep()"
              elevation="0"
              class="px-8"
              color="primary"
            >
              下一步
            </v-btn>
          </div>
        </v-card-text>
      </v-window-item>
      <v-window-item :value="1" style="height: 100%">
        <v-card-text           
          class="px-6 px-sm-11 py-0 d-flex justify-sm-space-between flex-column"
          style="height: 100%; min-height: 262px;"
        >
          <div>
            <div class="text-body-2 py-2 overflow-ellipsis">
              <v-btn icon x-small @click="clickLastStep()">
                <v-icon>
                  {{ statics.icons.mdiArrowLeft }}
                </v-icon>
              </v-btn>
              {{ userData.email }}
            </div>
            <div class="font-weight-bold text-h5">输入密码</div>
            <div>
              <!-- Fake DOM, used to help broswer to save password. -->
              <v-input 
                width="0" 
                :value="userData.email" 
                readonly 
                hide-details
              ></v-input>
            </div>            
            <v-form v-model="formStatus.passwordFormValid" @submit="$event.preventDefault(), clickNextStep()">
              <v-card-text class="pa-0">
                <v-text-field
                  v-model="userData.password"
                  :type="formStatus.passwordVisible ? 'text' : 'password'"
                  :rules="[formRules.required, formRules.password]"
                  ref="passwordTextField"
                  placeholder="请输入密码"
                  :append-icon="
                    formStatus.passwordVisible
                      ? statics.icons.mdiEyeOff
                      : statics.icons.mdiEye
                  "
                  @click:append="
                    formStatus.passwordVisible = !formStatus.passwordVisible
                  "
                ></v-text-field>
              </v-card-text>
            </v-form>
            <div class="mt-n2">
              <v-checkbox dense hide-details style="transform: scale(0.88) translate(-30px, 0)"
                v-model="formStatus.agreeTerms"
              >
                <template v-slot:label>
                  <div :class="['text-body-1', $vuetify.theme.dark ? 'white--text' : 'black--text']">
                    我已阅读并同意
                    <span class="inline-link" style="text-decoration: noney"
                      @click="isCurrentPath('^\/about(#.+)*') ? $router.push('/about') : '', 
                        closeDialog('register'), useInsitePush('#service_terms')"
                    >
                      用户协议及隐私政策
                    </span>
                  </div>
                </template>
              </v-checkbox>
            </div>            
          </div>
          <div
            class="px-0 pt-0 pb-6 pb-sm-11 pt-8 pt-sm-0 d-flex justify-end"
          >
            <v-btn
              @click="clickNextStep()"
              elevation="0"
              class="px-8"
              color="primary"
            >
              下一步
            </v-btn>
          </div>
        </v-card-text>
      </v-window-item>
      <v-window-item :value="2" style="height: 100%">
        <v-form v-model="formStatus.usernameFormValid" @submit="$event.preventDefault(), clickNextStep()">
          <v-card-text           
            class="px-6 px-sm-11 py-0 d-flex justify-sm-space-between flex-column"
            style="height: 100%; min-height: 262px;"
          >
            <div>
              <div class="text-body-2 py-2 overflow-ellipsis">
                <v-btn icon x-small @click="clickLastStep()">
                  <v-icon>
                    {{ statics.icons.mdiArrowLeft }}
                  </v-icon>
                </v-btn>
                {{ userData.email }}
              </div>
              <div class="text-body-1 mt-n2"
              >我们还需要一些信息才能设置你的帐户</div>
              <v-card-text class="pa-0">
                <div>
                  <v-text-field
                    v-model="userData.username"
                    :rules="[formRules.required, formRules.nickname]"
                    placeholder="用户名"
                    ref="usernameTextField"
                  ></v-text-field>
                </div>
                <div>
                  <v-select
                    v-model="userData.year"
                    :items="yearItems"
                    label="入学时间"
                  ></v-select>
                </div>
                <div class="pt-2">
                  <v-select
                    v-model="userData.grade"
                    :items="gradeItems"
                    label="学段"
                  ></v-select>
                </div>
              </v-card-text>
            </div>
            <div
              class="px-0 pb-6 pb-sm-11 pt-8 pt-sm-2 d-flex justify-end"
            >
              <v-btn
                @click="clickNextStep()"
                elevation="0"
                class="px-8"
                color="primary"
              >
                下一步
              </v-btn>
            </div>
          </v-card-text>
        </v-form>
      </v-window-item>
      <v-window-item :value="3" style="height: 100%">
        <v-card-text  
          class="px-6 px-sm-11 py-0 d-flex justify-sm-space-between flex-column"
          style="height: 100%; min-height: 262px;"
        > 
          <div>
            <div class="text-body-2 py-2 overflow-ellipsis">
              <v-btn icon x-small @click="clickLastStep()">
                <v-icon>
                  {{ statics.icons.mdiArrowLeft }}
                </v-icon>
              </v-btn>
              {{ userData.email }}
            </div>
            <div class="text-body-2 py-0" v-if="
              (!formStatus.loading) && 
              (!formStatus.captchaLoading) && 
              (formStatus.captchaBase64 !== '')"
            >
              <span>看不清？</span>
              <span class="inline-link" @click="getCaptcha()"
              >点击刷新</span>
            </div>
            <div v-else style="height: 20px; width: 100%;"></div>            
            <div class="d-flex justify-center pt-4 pt-sm-3">
              <div style="width: 200px" class="d-flex justify-center">
                <div v-if="formStatus.captchaLoading"
                  class="pt-5"
                >
                  <v-progress-circular
                    indeterminate
                    color="primary"
                    size="48"
                  ></v-progress-circular>
                </div>
                <div v-else-if="formStatus.captchaBase64 === ''"
                  class="pt-5"
                >
                  <div>验证码获取失败</div>
                  <div class="inline-link d-flex justify-center inline-link"
                    @click="getCaptcha()"
                  >点击重试</div>
                </div>
                <v-img                  
                  :src="`data:image/png;base64,${formStatus.captchaBase64}`"
                  v-else
                ></v-img>
              </div>
            </div>  
          </div>
          <div class="pb-6 pb-sm-11 pt-4 pt-sm-0">
            <v-otp-input
              length="6"
              type="number"
              v-model="userData.captcha"
              @finish="doRegister"
              ref="captchaOptInput"
            ></v-otp-input>
          </div>                  
        </v-card-text>
      </v-window-item>
      <v-window-item :value="4" style="height: 100%">
        <v-card-text           
          class="px-6 px-sm-11 py-0 d-flex justify-sm-space-between flex-column"
          style="height: 100%; min-height: 262px;"
        >
          <div class="text-h5 py-2 overflow-ellipsis">
            还差最后一步
          </div>
          <div class="d-flex justify-center py-sm-0 py-4">
            <v-icon 
              size="120" 
              color="info"
            >
              {{ statics.icons.mdiEmailAlertOutline }}
            </v-icon>
          </div>          
          <div class="px-0 pt-0 pb-6 pb-sm-11 pt-4 pt-sm-0 d-flex flex-column justify-end">
            <div class="text-body-1">
              激活邮件已发送至您的邮箱，请点击其中的激活链接以激活您的帐号
            </div>
          </div>
        </v-card-text>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script>
import { inject } from "vue";
import useRegister from "@/composables/users/forms/useRegister";
import useForms from "@/composables/users/forms/useForms";
import useAfterRender from "@/composables/global/useAfterRender";
import { gradeItems, yearItems } from "@/composables/global/useStaticData"
import logoDark from "@/assets/logo-white.svg";
import logoLight from "@/assets/logo.svg";
import useInsitePush from "@/composables/global/useInsitePush";
import useRouteMatch from "@/composables/global/useRouteMatch";

export default {
  setup() {
    const { formRules } = useForms();
    const { statics, userData, formStatus, doRegister, getCaptcha } = useRegister();
    const { isCurrentPath } = useRouteMatch();

    const closeDialog = inject("closeDialog");
    const openDialog = inject("openDialog");
    
    

    return { 
      statics, 
      userData, 
      formStatus, 
      formRules, 
      closeDialog, 
      openDialog, 
      doRegister, 
      getCaptcha, 
      yearItems, 
      gradeItems, 
      logoLight, 
      logoDark, 
      useInsitePush,
      isCurrentPath
    };
  },
  methods: {  
    clickLastStep() {
      if (this.formStatus.windowStep > 0) {
        this.formStatus.windowStep -= 1;
      }
    },

    clickNextStep() {
      if (this.formStatus.windowStep === 0 && this.formStatus.emailFormValid) {
        this.formStatus.windowStep += 1;
        // autofocus will break the transition animation, so we do it manually
        useAfterRender(() => this.$refs.passwordTextField.focus(), { retry: true, timeout: 300 });
      } else if (this.formStatus.windowStep === 1 && this.formStatus.passwordFormValid && this.formStatus.agreeTerms) {
        this.formStatus.windowStep += 1;
        useAfterRender(() => this.$refs.usernameTextField.focus(), { retry: true, timeout: 300 });
      } else if (this.formStatus.windowStep === 2 && this.userData.year && this.userData.grade) {        
        this.formStatus.windowStep += 1;
        useAfterRender(() => this.$refs.captchaOptInput.focus(), { retry: true, timeout: 300 })
      }
    },
  },
  mounted() {
    useAfterRender(() => this.$refs.emailTextField.focus(), { retry: true });
  },
};
</script>
<style scoped>
.inline-link {
  color: #0067bf;
  cursor: pointer;
}

.overflow-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.small-icon {
  width: 150px;
  height: 100%;
}
</style>