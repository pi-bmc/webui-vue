<template>
  <li>
    <form class="dropdown-form px-3 py-1" @submit.prevent><slot /></form>
  </li>
</template>

<script>
export default { name: 'BDropdownForm' };
</script>
