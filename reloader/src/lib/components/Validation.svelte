<script>
  let { success_text } = $props();
</script>

<div class="success-checkmark">
  <div class="check-icon">
    <span class="icon-line line-tip"></span>
    <span class="icon-line line-long"></span>
  </div>
  <div class="success-text">{success_text}</div>
</div>

<style>
  .success-checkmark {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    margin: 1rem;
  }

  .success-text {
    text-align: center;
    font-size: 3.5rem;
    font-weight: bold;
    color: #4CAF50;
    margin-top: 2rem;
    line-height: 1.3;
    padding: 1rem;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  }

  .check-icon {
    width: 150px;
    height: 150px;
    position: relative;
    border-radius: 50%;
    box-sizing: content-box;
    border: 8px solid #4CAF50;
  }

  .check-icon::before {
    top: 3px;
    left: -2px;
    width: 30px;
    transform-origin: 100% 50%;
    border-radius: 100px 0 0 100px;
  }

  .check-icon::after {
    top: 0;
    left: 30px;
    width: 60px;
    transform-origin: 0 50%;
    border-radius: 0 100px 100px 0;
    animation: rotate-circle 4.25s ease-in;
  }

  .icon-line {
    height: 10px;
    background-color: #4CAF50;
    display: block;
    border-radius: 4px;
    position: absolute;
    z-index: 10;
  }

  .line-tip {
    top: 86px;
    left: 26px;
    width: 47px;
    transform: rotate(45deg);
    animation: icon-line-tip 0.75s;
  }

  .line-long {
    top: 71px;
    right: 15px;
    width: 88px;
    transform: rotate(-45deg);
    animation: icon-line-long 0.75s;
  }

  @keyframes icon-line-tip {
    0% {
      width: 0;
      left: 1px;
      top: 35px;
    }
    54% {
      width: 0;
      left: 1px;
      top: 35px;
    }
    70% {
      width: 94px;
      left: -15px;
      top: 69px;
    }
    84% {
      width: 32px;
      left: 39px;
      top: 90px;
    }
    100% {
      width: 47px;
      left: 26px;
      top: 86px;
    }
  }

  @keyframes icon-line-long {
    0% {
      width: 0;
      right: 86px;
      top: 101px;
    }
    65% {
      width: 0;
      right: 86px;
      top: 101px;
    }
    84% {
      width: 103px;
      right: 0px;
      top: 65px;
    }
    100% {
      width: 88px;
      right: 15px;
      top: 71px;
    }
  }

  @media (max-width: 1200px) {
    .success-text {
      font-size: 3rem;
    }
    
    .check-icon {
      width: 120px;
      height: 120px;
      border-width: 6px;
    }
    
    .line-tip {
      top: 69px;
      left: 21px;
      width: 38px;
      height: 8px;
    }
    
    .line-long {
      top: 57px;
      right: 12px;
      width: 70px;
      height: 8px;
    }
  }
</style>