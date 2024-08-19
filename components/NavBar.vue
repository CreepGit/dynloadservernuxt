<template>
  <Menubar :model="items" breakpoint="700px">
    <template #end>
      <div class="flex gap-m">
        <!-- <Button :icon="hasClientTakenOver ? 'pi pi-desktop' : 'pi pi-server'" disabled outlined severity="warning" /> -->
        <!-- <Button icon="pi pi-moon" disabled outlined severity="warning" /> -->
        <Button
          :label="username"
          icon="pi pi-user"
          @click="toggleUserMenu"
          aria-haspopup="true"
          aria-controls="usermenu"
          outlined
          severity="info"
        />
        <Popover ref="usermenu">
          <div class="flex-column gap-l" style="width: 200px">
            <form
              class="flex-column gap-s"
              v-if="!authStore.hasAuth"
              @submit.prevent="login"
            >
              <InputText v-model="loginForm.username" placeholder="Username" />
              <InputText
                type="password"
                v-model="loginForm.password"
                placeholder="Password"
                :feedback="false"
              />
              <Button label="Login" type="submit" />
              <Message v-if="loginProblems" severity="warn"
                >🌶️ {{ loginProblems }}</Message
              >
            </form>
            <Button
              v-if="authStore.hasAuth"
              icon="pi pi-lock"
              label="Logout"
              @click="authStore.logout"
            />
            <pre style="max-width: 250px; overflow-x: scroll">{{
              {
                token: authStore.token,
                payload: authStore.payload,
                state: authStore.state,
                hasAuth: authStore.hasAuth,
              }
            }}</pre>
            <Button
              v-if="!authStore.hasAuth"
              label="Go to registration"
              @click="router.push('/register')"
              outlined
            />
          </div>
        </Popover>
        <Button
          :icon="wsValues.icon"
          @click="toggleWsMenu"
          aria-haspopup="true"
          aria-controls="wsmenu"
          :outlined="wsValues.outlined"
          :severity="wsValues.severity"
        />
        <Popover ref="wsmenu">
          <div class="flex-column gap-s">
            <InputGroup style="width: 240px">
              <InputGroupAddon
                ><i class="pi pi-wave-pulse"></i
              ></InputGroupAddon>
              <InputText :value="wsStore.status" disabled />
            </InputGroup>
            <InputGroup style="width: 240px">
              <InputGroupAddon><i class="pi pi-wave-pulse"></i></InputGroupAddon>
              <InputText :value="wsStore.activityName" disabled />
            </InputGroup>
            <InputGroup style="width: 240px">
              <InputGroupAddon><i class="pi pi-hashtag"></i></InputGroupAddon>
              <InputText :value="wsStore.updateCounter" disabled />
            </InputGroup>
            <Tree :value="wsTreeValues" style="--p-tree-padding: 0; --p-tree-node-padding: 0; --p-tree-indent: 0;">
              <template #default="slotProp">
                <span style="padding-right: 1ch;">{{ slotProp.node.label }}</span>
                <Badge v-show="slotProp.node.badge" :value="slotProp.node.badge" severity="info" size="small" />
              </template>
            </Tree>
          </div>
        </Popover>
      </div>
    </template>
  </Menubar>
</template>

<script setup lang="ts">
import type { MenuMethods } from 'primevue/menu';
import type { MenuItem } from 'primevue/menuitem';
import type { TreeNode } from 'primevue/treenode';

const router = useRouter()
const authStore = useAuthStore()
const wsStore = useWsStore()
const wsmenu = ref<MenuMethods|undefined>(undefined)
const usermenu = ref<MenuMethods|undefined>(undefined)
const username = computed(()=>{
  return authStore.payload?.username || ''
})
const loginProblems = ref("")
const loginForm = ref({username: "", password: ""})
const wsValues = computed(()=>{
  if (wsStore.status === "unopened") return { severity: "info", icon: "pi pi-server", outlined: true }
  if (wsStore.status === "closed") return { severity: "danger", icon: "pi pi-wifi", outlined: false }
  if (wsStore.status === "open") return { severity: "success", icon: "pi pi-wifi", outlined: true }
  return { severity: "danger", icon: "pi pi-times", outlined: false }
})
const hasClientTakenOver = ref(false)
const toast = useToast()
const items = computed<MenuItem[]>(()=>{
  return [
    { label: "Home", icon: "pi pi-home", class: router.currentRoute.value.path=='/'?"selectedMenuBarTab":"", command: () => router.push("/") },
    { label: "About", icon: "pi pi-paperclip", class: router.currentRoute.value.path=='/about'?"selectedMenuBarTab":"", command: () => router.push("/about") },
    { label: "Protected", icon: "pi pi-unlock", class: router.currentRoute.value.path=='/protected'?"selectedMenuBarTab":"", command: () => router.push("/protected") },
    { label: "Test", icon: 'pi pi-bolt', items: [
      { label: "Test toast", icon: "pi pi-comment", command: () => toast.add({life: 3500, closable: false, summary: "This is a test", severity: "info", detail: "No action required"}) },
      { label: "Go to /doesntexist", icon: "pi pi-compass", command: () => router.push("/doesntexist") },
    ] }
  ]
})
function toggleWsMenu(e: MouseEvent) {
  wsmenu.value?.toggle(e)
}
function toggleUserMenu(e: MouseEvent) {
  usermenu.value?.toggle(e)
}
async function login() {
  loginProblems.value = ""
  authStore.login(loginForm.value).then(()=>{
    loginProblems.value = ""
  }).catch((error: any)=>{
    loginProblems.value = error.statusMessage || 'Unknowable error'
  })
}
const wsTreeValues = computed<TreeNode[]>(()=>{
  const rootNode = []
  const activeNodes: TreeNode[] = []
  const inactiveNodes: TreeNode[] = []

  for (const url of wsStore.trackList) {
    const pendingUpdate = wsStore.updateQueue?.has(url) || false
    const count = wsStore.updateInformation[url]?.updateCount || 0
    const badge = count > 0 ? count.toString(): undefined
    const suffix = pendingUpdate ? " 🔄" : ""
    activeNodes.push({label: url + suffix, badge: badge, key: url, style: "opacity: 50%;"})
  }

  rootNode.push(
    {label: "Active", key: "active-parent", children: activeNodes},
    {label: "Inactive", key: "active-parent", children: inactiveNodes},
  )
  return rootNode
})
onMounted(()=>{
  hasClientTakenOver.value = true
})
</script>
