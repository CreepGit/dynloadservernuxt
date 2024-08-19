<template>
    <div>
        <Toast position="bottom-right" />
        <NavBar />
        <Card>
            <template #content v-if="error?.statusCode == 404">
                <h1>Oh no!</h1>
                <p>This is not a real page!</p>
            </template>
            <template #content v-else>
                <h1>Oh no!</h1>
                <p>An error occurred!</p>
                <h2>{{ error?.statusCode }}</h2>
                <pre>{{ {...error, statuCode: undefined, } }}</pre>
            </template>
        </Card>
    </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})
</script>